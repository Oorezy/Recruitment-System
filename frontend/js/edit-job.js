const editJobForm = document.getElementById("editJobForm");
const editJobMessage = document.getElementById("editJobMessage");

function getEditJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function toCommaSeparated(values) {
  return Array.isArray(values) ? values.join(", ") : "";
}

function toLineSeparated(values) {
  return Array.isArray(values) ? values.join("\n") : "";
}

function fillEditForm(job) {
  document.getElementById("editTitle").value = job.title || "";
  document.getElementById("editDepartment").value = job.department || "";
  document.getElementById("editLocation").value = job.location || "";
  document.getElementById("editJobType").value = job.job_type || "";
  document.getElementById("editDeadline").value = job.deadline || "";
  document.getElementById("editStatus").value = job.status || "Open";
  document.getElementById("editDescription").value = job.description || "";
  document.getElementById("editSkills").value = toCommaSeparated(job.required_skills);
  document.getElementById("editResponsibilities").value = toLineSeparated(job.responsibilities);
  document.getElementById("editQualifications").value = toLineSeparated(job.qualifications);
}

function parseCommaSeparatedValues(value) {
  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function parseLineSeparatedValues(value) {
  return value
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
}

async function loadEditJob() {
  const jobId = getEditJobIdFromUrl();

  if (!jobId) {
    editJobMessage.textContent = "Invalid job ID.";
    return;
  }

  try {
    const response = await apiRequest(`/jobs/${jobId}`);
    const job = response;
    fillEditForm(job);
  } catch (error) {
    editJobMessage.textContent = `Failed to load job: ${error.message}`;
  }
}

editJobForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  editJobMessage.style.color = "red";
  editJobMessage.textContent = "";

  const jobId = getEditJobIdFromUrl();

  const payload = {
    title: document.getElementById("editTitle").value.trim(),
    department: document.getElementById("editDepartment").value.trim(),
    location: document.getElementById("editLocation").value.trim(),
    job_type: document.getElementById("editJobType").value,
    deadline: document.getElementById("editDeadline").value,
    status: document.getElementById("editStatus").value,
    description: document.getElementById("editDescription").value.trim(),
    required_skills: parseCommaSeparatedValues(document.getElementById("editSkills").value.trim()),
    responsibilities: parseLineSeparatedValues(document.getElementById("editResponsibilities").value.trim()),
    qualifications: parseLineSeparatedValues(document.getElementById("editQualifications").value.trim())
  };

  try {
    const response = await apiRequest(`/recruiter/jobs/${jobId}`, "PUT", payload);

    editJobMessage.style.color = "green";
    editJobMessage.textContent = response.message || "Job updated successfully.";

    setTimeout(() => {
      window.location.href = "recruiter-jobs.html";
    }, 1000);
  } catch (error) {
    editJobMessage.style.color = "red";
    editJobMessage.textContent = error.message;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureIsRecruiter()) return;
  loadEditJob();
});