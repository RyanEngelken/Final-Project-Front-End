document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const logoutBtn = document.getElementById("logoutBtn");

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  } else {
    console.warn('Hamburger or navLinks element not found.');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html"; 
    });
  } else {
    console.warn('Logout button not found.');
  }
});
