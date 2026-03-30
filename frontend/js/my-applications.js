const myApplicationsContainer = document.getElementById("myApplicationsContainer");
const myApplicationsSearchInput = document.getElementById("myApplicationsSearchInput");
const myApplicationsSearchBtn = document.getElementById("myApplicationsSearchBtn");

let myApplications = [];

function getApplicationStatusClass(status) {
  const value = normalizeText(status);

  if (value === "applied") return "status-applied";
  if (value === "under review") return "status-under-review";
  if (value === "review") return "status-review";
  if (value === "shortlisted") return "status-shortlisted";
  if (value === "interview") return "status-interview";
  if (value === "rejected") return "status-rejected";
  if (value === "offer") return "status-offer";

  return "status-applied";
}

function renderMyApplications(applications) {
  if (!applications.length) {
    myApplicationsContainer.innerHTML = `
      <div class="empty-state">
        <p>You have not applied to any jobs yet.</p>
      </div>
    `;
    return;
  }

  myApplicationsContainer.innerHTML = applications.map(application => `
    <div class="list-item">
      <h4>${application.job_title}</h4>
      <p><strong>Company:</strong> ${application.company_name}</p>
      <p><strong>Applied On:</strong> ${application.applied_at}</p>
      <span class="status-badge ${getApplicationStatusClass(application.status)}">${application.status}</span>

      <div class="job-card-footer">
        <div class="action-row">
          <a class="btn-link" href="application-details.html?id=${application.id}">View Details</a>
        </div>
      </div>

    </div>
  `).join("");
}

function filterMyApplications() {
  const query = normalizeText(myApplicationsSearchInput.value);

  if (!query) {
    renderMyApplications(myApplications);
    return;
  }

  const filtered = myApplications.filter(application => {
    return (
      normalizeText(application.job_title).includes(query) ||
      normalizeText(application.company_name).includes(query) ||
      normalizeText(application.status).includes(query)
    );
  });

  renderMyApplications(filtered);
}

async function loadMyApplications() {
  try {
    const response = await apiRequest("/applications/my?applicant_id=" + getCurrentUser().id);
    myApplications = response;
    renderMyApplications(myApplications);
  } catch (error) {
    myApplicationsContainer.innerHTML = `
      <div class="empty-state">
        <p>Failed to load applications: ${error.message}</p>
      </div>
    `;
  }
}

myApplicationsSearchBtn.addEventListener("click", filterMyApplications);

myApplicationsSearchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    filterMyApplications();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (!ensureIsApplicant()) return;
  loadMyApplications();
});