const candidateDetailsContainer = document.getElementById("candidateDetailsContainer");

function getApplicationIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function createSkillTags(skills = []) {
  if (!skills.length) return "<p>No skills found.</p>";

  return `
    <div class="tag-list">
      ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}
    </div>
  `;
}

function renderCandidateDetails(candidate) {
  const matchedSkills = candidate.matched_skills || [];
    const missingSkills = candidate.missing_skills || [];

  const skills = candidate.skills || [];

  candidateDetailsContainer.innerHTML = `
    <h2>${candidate.applicant_name}</h2>

    <p class="info-row"><strong>Email:</strong> ${candidate.email}</p>
    <p class="info-row"><strong>Phone:</strong> ${candidate.phone}</p>
    <p class="info-row"><strong>Current Status:</strong> ${candidate.status}</p>
    ${
      candidate.match_score !== undefined && candidate.match_score !== null
        ? `<p class="info-row"><strong>Match Score:</strong> ${candidate.match_score}%</p>`
        : ""
    }

    <div class="detail-grid" style="margin-top: 24px;">
      <div class="detail-card">
        <h3>General Skills</h3>
        ${createSkillTags(skills)}
      </div>

      <div class="detail-card">
        <h3>Matched Skills</h3>
        ${createSkillTags(matchedSkills)}
      </div>

       <div class="detail-card">
        <h3>Missing Skills</h3>
        ${createSkillTags(missingSkills)}
      </div>

       <div class="detail-card">
        <h3>Cover Letter</h3>
        ${candidate.cover_letter ? `<p>${candidate.cover_letter}</p>` : `<p>No cover letter provided.</p>`}
      </div>

      <div class="detail-card">
        <h3>Resume</h3>
    ${
    candidate.resume_filename
      ? `
        <p>${candidate.resume_filename}</p>
        <div class="action-row" style="margin-top:10px;">
          <button class="btn-secondary btn-inline" onclick="downloadResume(${candidate.id})">
            View Resume
          </button>
        </div>
      `
      : `<p>No resume uploaded.</p>`
  }
      </div>

     <div class="detail-card" >
      <h3>Application Summary</h3>
      <p>${candidate.summary_report || "No summary available."}</p>
      </div>
    </div>

    <div class="job-details-section">
      <button class="btn-secondary" onclick="goBack()">Back</button>
    </div>
  `;
}

function goBack() {
  window.history.back();
}

async function loadCandidateDetails() {
  const applicationId = getApplicationIdFromUrl();

  if (!applicationId) {
    candidateDetailsContainer.innerHTML = `
      <div class="empty-state">
        <p>Invalid application ID.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await apiRequest(`/recruiter/applications/${applicationId}`);
    const candidate = response;
    renderCandidateDetails(candidate);
  } catch (error) {
    candidateDetailsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load candidate details: ${error.message}</p>
      </div>
    `;
  }
}

async function downloadResume(applicationId) {
  try {

    const response = await apiRequest(`/recruiter/applications/${applicationId}/resume`);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");

  } catch (error) {
    console.error("Error downloading resume:", error.message);
    alert(error.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureIsRecruiter()) return;
  loadCandidateDetails();
});