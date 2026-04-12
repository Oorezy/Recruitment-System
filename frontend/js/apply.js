const applyPageTitle = document.getElementById("applyPageTitle");
const applyJobSummary = document.getElementById("applyJobSummary");
const applyForm = document.getElementById("applyForm");
const applyMessage = document.getElementById("applyMessage");

let currentApplyJobId = null;
let currentApplyJob = null;

function getApplyJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("jobId");
}

function renderApplyJobSummary(job) {
  applyPageTitle.textContent = `Apply for ${job.title}`;
  applyJobSummary.innerHTML = `
    <h3>${job.title}</h3>
    <p><strong>Department:</strong> ${job.department}</p>
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Type:</strong> ${job.job_type}</p>
    <p><strong>Deadline:</strong> ${job.deadline}</p>
  `;
}

async function loadApplyJob() {
  currentApplyJobId = getApplyJobIdFromUrl();

  if (!currentApplyJobId) {
    applyJobSummary.innerHTML = `
      <div class="empty-state">
        <p>Invalid job ID.</p>
      </div>
    `;
    return;
  }

  try {
    const response = await apiRequest(`/jobs/${currentApplyJobId}`, "GET");
    currentApplyJob = response;
    renderApplyJobSummary(currentApplyJob);
  } catch (error) {
    applyJobSummary.innerHTML = `
      <div class="empty-state">
        <p>Failed to load job: ${error.message}</p>
      </div>
    `;
  }
}

applyForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!currentApplyJobId) return;

  applyMessage.style.color = "red";
  applyMessage.textContent = "";

  const coverLetter = document.getElementById("coverLetter").value.trim();
  const resumeFile = document.getElementById("resumeFile").files[0];
    const skills = document.getElementById("skills").value.trim();

  try {
    const formData = new FormData();
    formData.append("applicant_id", getCurrentUser().id);
    formData.append("job_id", currentApplyJobId);
    formData.append("cover_letter", coverLetter);
    formData.append("skills", skills);
    formData.append("resume", resumeFile);
    
    const response = await apiRequest(`/applications`, "POST", formData);

    applyMessage.style.color = "green";
    applyMessage.textContent = "Application submitted successfully.";

    window.location.href = "my-applications.html";
    // setTimeout(() => {
    //   window.location.href = "my-applications.html";
    // }, 1000);
  } catch (error) {
    applyMessage.style.color = "red";
    applyMessage.textContent = error.message;
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  if (!ensureIsApplicant()) return;
  await loadApplyJob();
});