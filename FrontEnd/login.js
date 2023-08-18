document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const errorMessage = document.getElementById("error_message");
  const logoutLink = document.querySelector(".logout");
  const loginLink = document.querySelector(".login");

  const showLogin = () => {
    loginLink.style.display = "block";
    logoutLink.style.display = "none";
  };

  const showLogout = () => {
    loginForm.style.display = "none";
    loginLink.style.display = "none";
    logoutLink.style.display = "block";
  };

  const logout = () => {
    localStorage.removeItem("token");
    showLogin();
  };

  if (localStorage.getItem("token")) {
    showLogout();
  } else {
    showLogin();
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
        showLogout();
      } else {
        errorMessage.textContent = "Email ou Password incorrect";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.textContent = "An error occurred during login";
    }
  });

  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });
});
