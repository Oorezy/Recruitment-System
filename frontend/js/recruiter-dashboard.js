const recruiterWelcomeTitle = document.getElementById("recruiterWelcomeTitle");
const recruiterProfileSummary = document.getElementById("recruiterProfileSummary");
const recentRecruiterJobs = document.getElementById("recentRecruiterJobs");
const recentRecruiterApplications = document.getElementById("recentRecruiterApplications");

const totalJobsCountEl = document.getElementById("totalJobsCount");
const openJobsCountEl = document.getElementById("openJobsCount");
const totalRecruiterApplicationsEl = document.getElementById("totalRecruiterApplications");
const recruiterShortlistedCountEl = document.getElementById("recruiterShortlistedCount");

function redirectIfNotRecruiter() {
  const role = localStorage.getItem("role");

  if (!role) {
    window.location.href = "login.html";
    return false;
  }

  if (role !== "recruiter") {
    window.location.href = "applicant-dashboard.html";
    return false;
  }

  return true;
}

function getApplicationStatusClass(status) {

  if (status === "applied") return "status-applied";
  if (status === "under review") return "status-under-review";
  if (status === "review") return "status-review";
  if (status === "shortlisted") return "status-shortlisted";
  if (status === "interview") return "status-interview";
  if (status === "rejected") return "status-rejected";
  if (status === "offer") return "status-offer";

  return "status-applied";
}

function getJobStatusClass(status) {

  if (status === "closed") return "status-closed";
  return "status-open";
}

function formatRecruiterName() {
  const user = getCurrentUser();

  if (user) {
    recruiterWelcomeTitle.textContent = `Welcome, ${user.first_name} ${user.last_name}`;
    return;
  }
}

async function renderRecruiterProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const fullName = `${user.first_name} ${user.last_name}`;
  const email = user.email;
  const department = "Recruitment";
  const roleTitle =  "Recruiter";

  recruiterProfileSummary.innerHTML = `
    <div class="profile-list">
      <div class="profile-item">
        <span>Full Name</span>
        <strong>${fullName}</strong>
      </div>

      <div class="profile-item">
        <span>Email</span>
        <strong>${email}</strong>
      </div>

      <div class="profile-item">
        <span>Department</span>
        <strong>${department}</strong>
      </div>

      <div class="profile-item">
        <span>Role</span>
        <strong>${roleTitle}</strong>
      </div>
    </div>

    <div class="quick-actions">
      <a href="recruiter-jobs.html" class="btn-primary" style="text-decoration:none; display:inline-block; width:auto;">Manage Jobs</a>
      <a href="create-job.html" class="btn-secondary" style="text-decoration:none; display:inline-block;">Create Job</a>
    </div>
  `;
}

function renderRecruiterJobs(jobs) {
  if (!jobs.length) {
    recentRecruiterJobs.innerHTML = `
      <div class="empty-state">
        <p>No jobs created yet.</p>
      </div>
    `;
    return;
  }

  recentRecruiterJobs.innerHTML = `
    <div class="list-stack">
      ${jobs.slice(0, 5).map(job => `
        <div class="list-item">
          <h4>${job.title}</h4>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Type:</strong> ${job.job_type}</p>
          <span class="status-badge ${getJobStatusClass(job.status)}">${job.status}</span>

          <div class="action-row">
            <a class="btn-link" href="recruiter-job-applications.html?jobId=${job.id}">View Applications</a>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderRecruiterApplications(applications) {
  if (!applications.length) {
    recentRecruiterApplications.innerHTML = `
      <div class="empty-state">
        <p>No applications found for your jobs yet.</p>
      </div>
    `;
    return;
  }

  recentRecruiterApplications.innerHTML = `
    <div class="list-stack">
      ${applications.slice(0, 6).map(application => `
        <div class="list-item">
          <h4>${application.applicant_name}</h4>
          <p><strong>Job:</strong> ${application.job_title}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p class="small-muted"><strong>Applied On:</strong> ${application.applied_at}</p>
          <span class="status-badge ${getApplicationStatusClass(application.status)}">${application.status}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderRecruiterStats(jobs, applications) {
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(job => job.status === "open").length;
  const totalApplications = applications.length;
  const shortlisted = applications.filter(app => app.status === "shortlisted").length;

  totalJobsCountEl.textContent = totalJobs;
  openJobsCountEl.textContent = openJobs;
  totalRecruiterApplicationsEl.textContent = totalApplications;
  recruiterShortlistedCountEl.textContent = shortlisted;
}

async function loadRecruiterDashboardData() {
  let jobs = [];
  let applications = [];

  try {
    const jobsResponse = await apiRequest("/recruiter/jobs?recruiter_id=" + getCurrentUser().id);
    jobs = jobsResponse;
    renderRecruiterJobs(jobs);
  } catch (error) {
    recentRecruiterJobs.innerHTML = `
      <div class="empty-state">
        <p>Failed to load jobs: ${error.message}</p>
      </div>
    `;
  }

  try {
    const applicationsResponse = await apiRequest("/recruiter/applications?recruiter_id=" + getCurrentUser().id);
    applications = applicationsResponse;

    renderRecruiterApplications(applications);
  } catch (error) {
    recentRecruiterApplications.innerHTML = `
      <div class="empty-state">
        <p>Failed to load applications: ${error.message}</p>
      </div>
    `;
  }

  renderRecruiterStats(jobs, applications);
}

document.addEventListener("DOMContentLoaded", async function () {
  if (!redirectIfNotRecruiter()) return;

  formatRecruiterName();
  await renderRecruiterProfile();
  await loadRecruiterDashboardData();
});