# Recruitment-System
A recruitment system designed for Google, this uses AI to help filter out applications and offer only the strongest of candidates

## 📌 Overview

This project is a **Recruitment Management System** designed to help recruiters efficiently manage job applications and assist applicants in tracking their application progress.

The system focuses on:

* Core **CRUD operations**
* Resume handling and storage
* Automated **AI-powered candidate matching**
* Role-based workflows (Applicant & Recruiter)

The backend is built using **FastAPI** and **PostgreSQL**, with **Mistral AI** used for intelligent resume-job matching.

---

## 🚀 Features

### 👤 Applicant Features

* Register and login
* Browse available jobs
* Apply for jobs with resume upload
* Track application status
* View match score and AI evaluation summary

### 🧑‍💼 Recruiter Features

* Create, update, and delete jobs
* View all job applications
* Access candidate profiles
* Download candidate resumes
* Update application status
* View AI-generated candidate match scores

### 🤖 AI Matching

* Resume text extraction
* Skill comparison against job requirements
* Match scoring (0–100)
* Identifies:

  * Matched skills
  * Missing skills
  * Summary of candidate suitability

---

## 🏗️ Tech Stack

### Frontend
* HTML
* CSS
* JavaScript

### Backend
* FastAPI
* SQLModel (ORM)
* PostgreSQL
* Alembic (migrations)

### AI Integration
* Mistral AI

---


## ⚙️ Setup Instructions

### 1. Clone the project

```bash
git clone <repo-url>
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### 3. Install dependencies

```bash
pip install -r pip-requirements.txt
```

---

## 🗄️ Database Setup

### Create PostgreSQL database

```sql
CREATE DATABASE recruitment;
```

### Configure `.env`

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/recruitment
MISTRAL_API_KEY=your_api_key
UPLOAD_DIR=uploads/resumes
```

---

## 🔄 Migrations (Alembic)

### Generate migration

```bash
alembic revision --autogenerate -m "initial migration"
```

### Apply migration

```bash
alembic upgrade head
```

---

## ▶️ Run the Server

```bash
uvicorn app.main:app
```

Access:

* API root → http://127.0.0.1:8000/
* Swagger docs → http://127.0.0.1:8000/docs

---

## 📦 Core Modules

### 1. Users

* Register/Login
* Roles:

  * `applicant`
  * `recruiter`

---

### 2. Jobs

* Create job (recruiter)
* View jobs (public)
* Update/Delete job

---

### 3. Applications

* Submit application
* Track status
* View application history

---

### 4. Resume Handling

* Upload resumes during application
* Stored on disk
* Path saved in DB

---


## 🤖 AI Matching (Mistral)

### Flow

1. Resume uploaded
2. Resume text extracted
3. Sent to Mistral AI
4. Structured JSON returned
5. Stored in DB

---

### Example AI Output

```json
{
  "score": 78,
  "matched_skills": ["Python", "SQL"],
  "missing_skills": ["Docker"],
  "summary": "Strong backend candidate with minor skill gaps."
}
```

---


## 🧠 Matching Logic

The system evaluates:

* Overlap between resume skills and job requirements
* Generates:

  * Match score (0–100)
  * Matched skills
  * Missing skills
  * Summary insight

---

## 📊 Application Status Flow

```
Applied → Under Review → Shortlisted → Interview → Offer → Rejected
```

Each change is logged in:

* `application_status_history`

---

## 🔗 API Overview

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Jobs

* `GET /api/jobs`
* `GET /api/jobs/{id}`

### Recruiter Jobs

* `POST /api/recruiter/jobs`
* `PUT /api/recruiter/jobs/{id}`
* `DELETE /api/recruiter/jobs/{id}`

### Applications

* `POST /api/applications`
* `GET /api/applications/my`
* `GET /api/applications/my/{id}`

### Recruiter Applications

* `GET /api/recruiter/jobs/{id}/applications`
* `PUT /api/recruiter/applications/{id}/status`
* `GET /api/recruiter/applications/{id}`

### Resume Download

* `GET /api/recruiter/applications/{id}/resume`

---

## 🧪 Testing Tips

1. Create a recruiter
2. Create a job with required skills
3. Create an applicant
4. Upload resume + apply
5. Check:

   * match score
   * recruiter view
   * resume download

---

## 📌 Summary

This project demonstrates:

* Full-stack CRUD system design
* REST API development with FastAPI
* Database modeling with SQLModel
* File handling and uploads
* AI integration using Mistral
* Clean modular backend architecture

