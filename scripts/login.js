const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerModal = document.getElementById("registerModal");
  const showRegister = document.getElementById("showRegister");

  showRegister.addEventListener("click", () => {
    registerModal.style.display = "block";
  });

  // Login request
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch('http://localhost:3000/api/auth', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert("Login failed");
    }
  });

  // Register request
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    const res = await fetch('http://localhost:3000/api/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Account created! You can now log in.");
      registerModal.style.display = "none";
    } else {
      alert("Registration failed");
    }
  });
});


