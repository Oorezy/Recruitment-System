function logout() {
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
});

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

function normalizeText(value) {
  return (value || "").toString().trim().toLowerCase();
}

function ensureIsRecruiter() {
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

function ensureIsApplicant() {
  const role = localStorage.getItem("role");

    if (!role) {
        window.location.href = "login.html";
        return false;
    }

    if (role !== "applicant") {
        window.location.href = "recruiter-dashboard.html";
        return false;
    }

    return true;
}