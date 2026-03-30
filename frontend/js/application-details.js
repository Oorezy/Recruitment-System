const applicationDetailsContainer = document.getElementById("applicationDetailsContainer");

function getApplicationIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getStatusClass(status) {
  const value = (status || "").toString().trim().toLowerCase();

  if (value === "applied") return "status-applied";
  if (value === "under review") return "status-under-review";
  if (value === "review") return "status-review";
  if (value === "shortlisted") return "status-shortlisted";
  if (value === "interview") return "status-interview";
  if (value === "rejected") return "status-rejected";
  if (value === "offer") return "status-offer";

  return "status-applied";
}

function renderStatusHistory(history = []) {
  if (!history.length) {
    return `<p>No status history available.</p>`;
  }

  return `
    <div class="timeline-list">
      ${history.map(item => `
        <div class="timeline-item">
          <h4>${item.status}</h4>
          <p>${item.comment || "No additional note."}</p>
          <p class="small-muted">${item.updated_at}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderApplicationDetails(application) {
  applicationDetailsContainer.innerHTML = `
    <h2>${application.job_title || "Application Details"}</h2>

    <p class="info-row"><strong>Company:</strong> ${application.company_name}</p>
    <p class="info-row"><strong>Applied On:</strong> ${application.applied_at}</p>
    <p class="info-row">
      <strong>Current Status:</strong>
      <span class="status-badge ${getStatusClass(application.status)}">${application.status}</span>
    </p>

    <div class="info-box">
      <h3>Cover Letter / Note</h3>
      <p>${application.cover_letter || "No note submitted."}</p>
    </div>

     <div class="job-details-section">
      <h3>Required Skills</h3>
      ${
        application.skills.length
          ? `<div class="job-skills">${application.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}</div>`
          : `<p>No skills listed.</p>`
      }
    </div>

    <div class="job-details-section">
      <h3>Status History</h3>
      ${renderStatusHistory(application.status_history || [])}
    </div>

    <div class="job-details-section">
      <button class="btn-secondary" onclick="goBackToApplications()">Back</button>
    </div>
  `;
}

function goBackToApplications() {
  window.location.href = "my-applications.html";
}

async function loadApplicationDetails() {
  const applicationId = getApplicationIdFromUrl();

  if (!applicationId) {
    applicationDetailsContainer.innerHTML = `
      <div class="empty-state">
        <p>Invalid application ID.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await apiRequest(`/applications/my/${applicationId}?applicant_id=${getCurrentUser().id}`);
    const application = response.application || response;
    renderApplicationDetails(application);
  } catch (error) {
    applicationDetailsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load application details: ${error.message}</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureIsApplicant()) return;
  loadApplicationDetails();
});