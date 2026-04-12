from pathlib import Path
from fastapi import Depends
from pypdf import PdfReader

import json, re
from mistralai.client import Mistral
from sqlmodel import Session

from app.models.application import Application
from app.utils import comma_string_to_list, list_to_comma_string
from app.models.job import Job
from app.config import settings
from app.db.session import engine

import logging

mistral_client = Mistral(api_key=settings.MISTRAL_API_KEY)

SCHEMA = {
    "name": "resume_match_result",
    "schema": {
        "type": "object",
        "properties": {
            "score": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100
            },
            "matched_skills": {
                "type": "array",
                "items": {"type": "string"}
            },
            "missing_skills": {
                    "type": "array",
                    "items": {"type": "string"}
            },
            "summary": {
                    "type": "string"
                }
            },
            "required": ["score", "matched_skills", "missing_skills", "summary"],
            "additionalProperties": False
    }
}

def score_resume_against_job(application_id: int):

   
    logging.info("Scoring resume for application ID %s", application_id)
    try:
        with Session(engine) as session:

            application = session.get(Application, application_id)
            job = session.get(Job, application.job_id)

            resume_text = extract_resume_text(application.resume_path)
            required_skills = comma_string_to_list(job.required_skills or "")

            prompt = f"""
You are scoring a candidate resume against a job.

Job title:
{job.title}

Job description:
{job.description}

Required skills:
{required_skills}

Candidate resume text:
{resume_text[:10000]}

Rules:
- Score from 0 to 100.
- Only use evidence found in the resume text.
- matched_skills must contain only skills clearly present in the resume.
- missing_skills must contain important required skills not clearly present.
- summary must be brief and factual.
    """.strip()

            logging.info("\n\nSending prompt to AI for application ID %s: %s", application_id, prompt)

            response = mistral_client.chat.complete(
                model=settings.MISTRAL_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You must return valid JSON matching the provided schema."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format=SCHEMA,
                temperature=0,
            )

            logging.info("\nAI response received " + str(response))  
            content = response.choices[0].message.content
            if not content:
                raise ValueError("AI returned an empty response.")

            content = content.strip()
            match = re.search(r"```(?:json)?\s*(.*?)\s*```", content, flags=re.DOTALL)
            if match:
                content = match.group(1).strip()

            data = json.loads(content)

            application.match_score = int(data["score"])
            application.matched_skills = list_to_comma_string(data["matched_skills"])
            application.missing_skills = list_to_comma_string(data["missing_skills"])
            application.summary_report = data["summary"]
            session.add(application)
            session.commit()

            logging.info("Resume scoring result: %s", {
                "score": int(data["score"]),
                "matched_skills": data["matched_skills"],
                "missing_skills": data["missing_skills"],
                "summary": data["summary"],
            })
    except Exception as e:
        logging.error("Error scoring resume: %s", str(e))
        

def extract_resume_text(file_path: str) -> str:
    reader = PdfReader(file_path)
    parts: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        if text.strip():
            parts.append(text)

    return "\n".join(parts).strip()
