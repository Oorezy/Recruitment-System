const jobsContainer = document.getElementById("jobsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let allJobs = [];

function createSkillsHtml(skills = []) {
  if (!skills.length) return "<p class='job-meta'>No skills listed</p>";

  return `
    <div class="job-skills">
      ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}
    </div>
  `;
}

function renderJobs(jobs) {
  if (!jobs.length) {
    jobsContainer.innerHTML = `
      <div class="empty-state">
        <p>No jobs found.</p>
      </div>
    `;
    return;
  }

  jobsContainer.innerHTML = jobs.map(job => `
    <div class="job-card">
      <h3>${job.title}</h3>
      <p class="job-meta"><strong>Location:</strong> ${job.location || "Not specified"}</p>
      <p class="job-meta"><strong>Type:</strong> ${job.job_type || "Not specified"}</p>
      <p class="job-description">
        ${job.description ? job.description.substring(0, 140) : "No description available"}${job.description && job.description.length > 140 ? "..." : ""}
      </p>
      ${createSkillsHtml(job.required_skills || [])}
      <div class="job-actions">
        <button class="btn-primary" onclick="viewJobDetails(${job.id})">View Details</button>
      </div>
    </div>
  `).join("");
}

function filterJobs() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderJobs(allJobs);
    return;
  }

  const filteredJobs = allJobs.filter(job => {
    const title = (job.title || "").toLowerCase();
    const location = (job.location || "").toLowerCase();
    const description = (job.description || "").toLowerCase();
    const skills = (job.required_skills || []).join(" ").toLowerCase();

    return (
      title.includes(query) ||
      location.includes(query) ||
      description.includes(query) ||
      skills.includes(query)
    );
  });

  renderJobs(filteredJobs);
}

function viewJobDetails(jobId) {
  window.location.href = `job-details.html?id=${jobId}`;
}

async function loadJobs() {
  try {
    const response = await apiRequest("/jobs");

    allJobs = response || [];
    renderJobs(allJobs);
  } catch (error) {
    jobsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load jobs: ${error.message}</p>
      </div>
    `;
  }
}

searchBtn.addEventListener("click", filterJobs);

searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    filterJobs();
  }
});

document.addEventListener("DOMContentLoaded", loadJobs);