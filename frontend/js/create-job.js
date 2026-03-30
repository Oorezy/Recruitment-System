const createJobForm = document.getElementById("createJobForm");
const createJobMessage = document.getElementById("createJobMessage");

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

createJobForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  createJobMessage.style.color = "red";
  createJobMessage.textContent = "";

  const payload = {
    title: document.getElementById("title").value.trim(),
    department: document.getElementById("department").value.trim(),
    location: document.getElementById("location").value.trim(),
    job_type: document.getElementById("jobType").value,
    deadline: document.getElementById("deadline").value,
    status: document.getElementById("status").value,
    description: document.getElementById("description").value.trim(),
    required_skills: parseCommaSeparatedValues(document.getElementById("skills").value.trim()),
    responsibilities: parseLineSeparatedValues(document.getElementById("responsibilities").value.trim()),
    qualifications: parseLineSeparatedValues(document.getElementById("qualifications").value.trim()),
    recruiter_id: getCurrentUser().id
  };

  try {
    const response = await apiRequest("/recruiter/jobs", "POST", payload);

    createJobMessage.style.color = "green";
    createJobMessage.textContent = response.message || "Job created successfully.";

    setTimeout(() => {
      window.location.href = "recruiter-jobs.html";
    }, 1000);
  } catch (error) {
    createJobMessage.style.color = "red";
    createJobMessage.textContent = error.message;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  ensureIsRecruiter();
});