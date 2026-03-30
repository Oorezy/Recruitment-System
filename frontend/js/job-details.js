const jobDetailsContainer = document.getElementById("jobDetailsContainer");

function getJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderJobDetails(job) {
  const skills = job.required_skills || [];
  const responsibilities = job.responsibilities || [];
  const qualifications = job.qualifications || [];

  jobDetailsContainer.innerHTML = `
    <h2>${job.title}</h2>

    <p class="info-row"><strong>Location:</strong> ${job.location || "Not specified"}</p>
    <p class="info-row"><strong>Job Type:</strong> ${job.job_type || "Not specified"}</p>
    <p class="info-row"><strong>Department:</strong> ${job.department || "Not specified"}</p>
    <p class="info-row"><strong>Deadline:</strong> ${job.deadline || "Not specified"}</p>

    <div class="job-details-section">
      <h3>Description</h3>
      <p>${job.description || "No description available."}</p>
    </div>

    <div class="job-details-section">
      <h3>Required Skills</h3>
      ${
        skills.length
          ? `<div class="job-skills">${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}</div>`
          : `<p>No skills listed.</p>`
      }
    </div>

    <div class="job-details-section">
      <h3>Responsibilities</h3>
      ${
        responsibilities.length
          ? `<ul>${responsibilities.map(item => `<li>${item}</li>`).join("")}</ul>`
          : `<p>No responsibilities listed.</p>`
      }
    </div>

    <div class="job-details-section">
      <h3>Qualifications</h3>
      ${
        qualifications.length
          ? `<ul>${qualifications.map(item => `<li>${item}</li>`).join("")}</ul>`
          : `<p>No qualifications listed.</p>`
      }
    </div>

    <div class="job-details-section">
      <button class="btn-primary" style="width: fit-content" onclick="applyForJob(${job.id})">Apply Now</button>
      <button class="btn-secondary" onclick="goBackToJobs()">Back to Jobs</button>
    </div>
  `;
}

function applyForJob(jobId) {
  const role = localStorage.getItem("role");

  if (!role) {
    alert("Please login first to apply for a job.");
    window.location.href = "login.html";
    return;
  }

  if (role !== "applicant") {
    alert("Only applicants can apply for jobs.");
    return;
  }

  window.location.href = `apply.html?jobId=${jobId}`;
}

function goBackToJobs() {
  window.location.href = "jobs.html";
}

async function loadJobDetails() {
  const jobId = getJobIdFromUrl();

  if (!jobId) {
    jobDetailsContainer.innerHTML = `
      <div class="empty-state">
        <p>Invalid job ID.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await apiRequest(`/jobs/${jobId}`);
    const job = response;

    renderJobDetails(job);
  } catch (error) {
    jobDetailsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load job details: ${error.message}</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadJobDetails);