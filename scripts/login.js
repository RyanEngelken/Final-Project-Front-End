document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const registerModal = document.getElementById("registerModal");
  const showRegister = document.getElementById("showRegister");
  const closeRegisterModal = document.getElementById("closeRegisterModal");


  showRegister.addEventListener("click", () => {
    registerModal.style.display = "block";
  });

  window.addEventListener("click", (event) => {
    if (event.target === registerModal) {
      registerModal.style.display = "none";
    }
  });
  
  closeRegisterModal.addEventListener("click", () => {
  registerModal.style.display = "none";
});

  // Login request
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`https://shared-slime-viola.glitch.me/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);    
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data._id); 
        window.location.href = "index.html";
      } else {
        const errorData = await res.json();
        alert(`Login failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  });

  // Register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("role").value;

    if (!username || !password || !role) {
      alert("Please fill all fields correctly.");
      return;
    }

    try {
      const res = await fetch(`https://shared-slime-viola.glitch.me/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        alert("Account created! You can now log in.");
        registerModal.style.display = "none";
      } else {
        const errorData = await res.json();
        alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  });
});