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