const jobApplicationsTitle = document.getElementById("jobApplicationsTitle");
const jobApplicationsContainer = document.getElementById("jobApplicationsContainer");
const applicationSearchInput = document.getElementById("applicationSearchInput");
const applicationSearchBtn = document.getElementById("applicationSearchBtn");

let allApplications = [];
let currentJobId = null;

function getJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("jobId");
}

function normalizeValue(value) {
  return (value || "").toString().trim().toLowerCase();
}

function getStatusClass(status) {
  const value = normalizeValue(status);

  if (value === "applied") return "status-applied";
  if (value === "under review") return "status-under-review";
  if (value === "review") return "status-review";
  if (value === "shortlisted") return "status-shortlisted";
  if (value === "interview") return "status-interview";
  if (value === "rejected") return "status-rejected";
  if (value === "offer") return "status-offer";

  return "status-applied";
}

function renderApplications(applications) {
  if (!applications.length) {
    jobApplicationsContainer.innerHTML = `
      <div class="empty-state">
        <p>No applications found for this job.</p>
      </div>
    `;
    return;
  }

  jobApplicationsContainer.innerHTML = `
    <div class="application-grid">
      ${applications.map(application => `
        <div class="list-item">
          <h4>${application.applicant_name}</h4>
          <p><strong>Email:</strong> ${application.email || "Not provided"}</p>
          <p><strong>Applied On:</strong> ${application.applied_at || "Not available"}</p>
          <span class="status-badge ${getStatusClass(application.status)}">${application.status}</span>
          ${
            application.match_score !== undefined && application.match_score !== null
              ? `<div class="score-badge">Match Score: ${application.match_score}%</div>`
              : ""
          }

          <div class="application-actions">
            <a class="btn-link" href="applicant-details.html?id=${application.id}">View Applicant</a>

            <select class="select-inline" id="status-${application.id}">
              <option value="Applied" ${application.status === "Applied" ? "selected" : ""}>Applied</option>
              <option value="Under Review" ${application.status === "Under Review" ? "selected" : ""}>Under Review</option>
              <option value="Shortlisted" ${application.status === "Shortlisted" ? "selected" : ""}>Shortlisted</option>
              <option value="Interview" ${application.status === "Interview" ? "selected" : ""}>Interview</option>
              <option value="Offer" ${application.status === "Offer" ? "selected" : ""}>Offer</option>
              <option value="Rejected" ${application.status === "Rejected" ? "selected" : ""}>Rejected</option>
            </select>

            <button class="btn-primary btn-inline" onclick="updateApplicationStatus(${application.id})">Update</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function filterApplications() {
  const query = normalizeValue(applicationSearchInput.value);

  if (!query) {
    renderApplications(allApplications);
    return;
  }

  const filtered = allApplications.filter(application => {
    return (
      normalizeValue(application.applicant_name).includes(query) ||
      normalizeValue(application.candidate_name).includes(query) ||
      normalizeValue(application.email).includes(query) ||
      normalizeValue(application.status).includes(query)
    );
  });

  renderApplications(filtered);
}

async function loadJobApplications() {
  currentJobId = getJobIdFromUrl();

  if (!currentJobId) {
    jobApplicationsContainer.innerHTML = `
      <div class="empty-state">
        <p>Invalid job ID.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await apiRequest(`/recruiter/jobs/${currentJobId}/applications`);

    allApplications = response;
    if (response[0].job_title) {
      jobApplicationsTitle.textContent = `${response[0].job_title} - Applications`;
    }

    renderApplications(allApplications);
  } catch (error) {
    jobApplicationsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load applications: ${error.message}</p>
      </div>
    `;
  }
}

async function updateApplicationStatus(applicationId) {
  const selectEl = document.getElementById(`status-${applicationId}`);
  const status = selectEl.value;

  try {
    await apiRequest(`/recruiter/applications/${applicationId}/status`, "PUT", { status });

    allApplications = allApplications.map(application => {
      if (String(application.id) === String(applicationId)) {
        return { ...application, status };
      }
      return application;
    });

    renderApplications(allApplications);
    alert("Application status updated successfully.");
  } catch (error) {
    alert(`Failed to update application status: ${error.message}`);
  }
}

applicationSearchBtn.addEventListener("click", filterApplications);

applicationSearchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    filterApplications();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureIsRecruiter()) return;
  loadJobApplications();
});