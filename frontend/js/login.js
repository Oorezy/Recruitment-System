const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    messageEl.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await apiRequest("/auth/login", "POST", {
        email,
        password
      });

      localStorage.setItem("id", response.id);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response));

      if (response.role === "recruiter") {
        window.location.href = "recruiter-dashboard.html";
      } else {
        window.location.href = "applicant-dashboard.html";
      }
    } catch (error) {
      messageEl.style.color = "red";
      messageEl.textContent = "Invalid email or password";
    }
  });

  
