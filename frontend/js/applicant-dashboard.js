const welcomeTitle = document.getElementById("welcomeTitle");
const profileSummary = document.getElementById("profileSummary");
const recentApplications = document.getElementById("recentApplications");

const totalApplicationsEl = document.getElementById("totalApplications");
const underReviewCountEl = document.getElementById("underReviewCount");
const shortlistedCountEl = document.getElementById("shortlistedCount");
const interviewCountEl = document.getElementById("interviewCount");

function normalizeStatus(status) {
  return (status || "Applied").toString().trim().toLowerCase();
}

function getStatusClass(status) {
  const value = normalizeStatus(status);

  if (value === "applied") return "status-applied";
  if (value === "under review") return "status-under-review";
  if (value === "review") return "status-review";
  if (value === "shortlisted") return "status-shortlisted";
  if (value === "interview") return "status-interview";
  if (value === "rejected") return "status-rejected";
  if (value === "offer") return "status-offer";

  return "status-applied";
}

function renderWelcome() {
  const user = getCurrentUser();

  if (user) {
    welcomeTitle.textContent = `Welcome, ${user.first_name} ${user.last_name}`;
    return;
  }
}

function renderProfile(profile) {

  const fullName = profile.full_name;
  const email = profile.email;
  const phone = profile.phone;
  const skills = Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || "Not provided");
  const resume = profile.resume_filename;

  profileSummary.innerHTML = `
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
        <span>Phone</span>
        <strong>${phone}</strong>
      </div>

      <div class="profile-item">
        <span>Skills</span>
        <strong>${skills}</strong>
      </div>

      <div class="profile-item">
        <span>Resume</span>
        <strong>${resume}</strong>
      </div>
    </div>

    <div class="quick-actions">
      <a href="jobs.html" class="btn-primary" style="text-decoration:none; display:inline-block; width:auto;">Browse Jobs</a>
    </div>
  `;
}

function renderRecentApplications(applications) {
  if (!applications.length) {
    recentApplications.innerHTML = `
      <div class="empty-state">
        <p>You have not applied to any jobs yet.</p>
      </div>
    `;
    return;
  }

  recentApplications.innerHTML = `
    <div class="application-list">
      ${applications.slice(0, 5).map(application => `
        <div class="application-item">
          <h4>${application.job_title}</h4>
          <p><strong>Company:</strong> ${application.company_name}</p>
          <p><strong>Applied On:</strong> ${application.applied_at}</p>
          <span class="status-badge ${getStatusClass(application.status)}">${application.status}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStats(applications) {
  const total = applications.length;
  const underReview = applications.filter(app => normalizeStatus(app.status) === "under review").length;
  const shortlisted = applications.filter(app => normalizeStatus(app.status) === "shortlisted").length;
  const interview = applications.filter(app => normalizeStatus(app.status) === "interview").length;

  totalApplicationsEl.textContent = total;
  underReviewCountEl.textContent = underReview;
  shortlistedCountEl.textContent = shortlisted;
  interviewCountEl.textContent = interview;
}

async function loadApplicantProfile() {
  
    const user = getCurrentUser();
    renderProfile({
      full_name: user? `${user.first_name} ${user.last_name}` : "Not provided",
      email: user?.email || "Not provided",
      phone: user?.phone || "Not provided",
      skills: "Not provided",
      resume: "No resume uploaded"
    });

}

async function loadApplicantApplications() {
  try {
    const response = await apiRequest(`/applications/my?applicant_id=${getCurrentUser().id}`);
    const applications = response;

    renderStats(applications);
    renderRecentApplications(applications);
  } catch (error) {
    totalApplicationsEl.textContent = "0";
    underReviewCountEl.textContent = "0";
    shortlistedCountEl.textContent = "0";
    interviewCountEl.textContent = "0";

    recentApplications.innerHTML = `
      <div class="empty-state">
        <p>Failed to load applications: ${error.message}</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  if (!ensureIsApplicant()) return;

  renderWelcome();
  await loadApplicantProfile();
  await loadApplicantApplications();
});