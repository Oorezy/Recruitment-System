const recruiterJobsContainer = document.getElementById("recruiterJobsContainer");
const recruiterJobSearchInput = document.getElementById("recruiterJobSearchInput");
const recruiterJobSearchBtn = document.getElementById("recruiterJobSearchBtn");

let recruiterJobs = [];

function renderRecruiterJobsList(jobs) {
  if (!jobs.length) {
    recruiterJobsContainer.innerHTML = `
      <div class="empty-state">
        <p>No jobs found.</p>
      </div>
    `;
    return;
  }

  recruiterJobsContainer.innerHTML = jobs.map(job => `
    <div class="list-item">
      <h4>${job.title}</h4>
      <p><strong>Department:</strong> ${job.department}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.job_type}</p>
      <p><strong>Deadline:</strong> ${job.deadline}</p>
      <span class="status-badge ${job.status === "closed" ? "status-closed" : "status-open"}">${job.status}</span>

      <div class="job-card-footer">
        <div class="action-row">
          <a class="btn-link" href="edit-job.html?id=${job.id}">Edit</a>
          <a class="btn-link" href="recruiter-job-applications.html?jobId=${job.id}">Applications</a>
        </div>

        <button class="danger-link" onclick="deleteJob(${job.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function filterRecruiterJobs() {
  const query = normalizeText(recruiterJobSearchInput.value);

  if (!query) {
    renderRecruiterJobsList(recruiterJobs);
    return;
  }

  const filtered = recruiterJobs.filter(job => {
    return (
      normalizeText(job.title).includes(query) ||
      normalizeText(job.location).includes(query) ||
      normalizeText(job.job_type).includes(query) ||
      normalizeText(job.department).includes(query)
    );
  });

  renderRecruiterJobsList(filtered);
}

async function loadRecruiterJobsPage() {
  try {
    const response = await apiRequest("/recruiter/jobs?recruiter_id=" + getCurrentUser().id);
    recruiterJobs = response;
    renderRecruiterJobsList(recruiterJobs);
  } catch (error) {
    recruiterJobsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load jobs: ${error.message}</p>
      </div>
    `;
  }
}

async function deleteJob(jobId) {
  const confirmed = confirm("Are you sure you want to delete this job?");
  if (!confirmed) return;

  try {
    await apiRequest(`/recruiter/jobs/${jobId}`, "DELETE");
    recruiterJobs = recruiterJobs.filter(job => String(job.id) !== String(jobId));
    renderRecruiterJobsList(recruiterJobs);
    alert("Job deleted successfully.");
  } catch (error) {
    alert(`Failed to delete job: ${error.message}`);
  }
}

recruiterJobSearchBtn.addEventListener("click", filterRecruiterJobs);

recruiterJobSearchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    filterRecruiterJobs();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureIsRecruiter()) return;
  loadRecruiterJobsPage();
});