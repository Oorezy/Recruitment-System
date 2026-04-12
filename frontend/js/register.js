const registerForm = document.getElementById("registerForm");
const registerMessageEl = document.getElementById("message");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  registerMessageEl.textContent = "";

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;
  const phone= document.getElementById("phoneNumber").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword) {
    registerMessageEl.textContent = "Passwords do not match";
    return;
  }

  try {
    const response = await apiRequest("/auth/register", "POST", {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password,
      role
    });

    registerMessageEl.style.color = "green";
    registerMessageEl.textContent = response.message || "Registration successful. Redirecting...";

    localStorage.setItem("id", response.id);
    localStorage.setItem("role", response.role);
    localStorage.setItem("user", JSON.stringify(response));

      setTimeout(() => {
        if (response.role === "recruiter") {
          window.location.href = "recruiter-dashboard.html";
        } else {
          window.location.href = "applicant-dashboard.html";
        }
      }, 1000);
  } catch (error) {
    registerMessageEl.style.color = "red";
    registerMessageEl.textContent = error.message;
  }
});