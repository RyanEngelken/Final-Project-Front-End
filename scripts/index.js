document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html"; 
    return;
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1])); 
  const userRole = decodedToken.role;

  if (userRole === "student") {
    document.getElementById("createCourseButton").style.display = "none";
    document.getElementById("deleteCourseButton").style.display = "none";
  } else if (userRole === "teacher") {
    document.getElementById("createCourseButton").style.display = "block";
    document.getElementById("deleteCourseButton").style.display = "none";
  } else {
    window.location.href = "login.html";
  }


});
