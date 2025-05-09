addEventListener("DOMContentLoaded", function () {
  document.querySelector("#addBtn").addEventListener("click", addCourse);
});

async function addCourse(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Only allows teachers to add courses / see this page
  if (role !== "teacher") {
    alert("Only teachers can add courses.");
    return;
  }

  const course = {
    courseName: document.querySelector("#courseName").value,
    courseDescription: document.querySelector("#courseDescription").value,
    instructor: document.querySelector("#instructor").value,
    courseId: document.querySelector("#courseId").value,
    dayOfWeek: document.querySelector("#dayOfWeek").value,
    timeOfClass: document.querySelector("#timeOfClass").value,
    creditHours: document.querySelector("#creditHours").value,
    subjectArea: document.querySelector("#subjectArea").value
  };

  // Add Post
  try {
    const response = await fetch("https://shared-slime-viola.glitch.me/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth": token 
      },
      body: JSON.stringify(course)
    });

    if (response.ok) {
      await response.json();
      alert("Course added successfully!");
      document.querySelector("#addCourseForm").reset();
    } else {
      const errorData = await response.json();
      document.querySelector("#error").innerHTML = `Error: ${errorData.error || "Something went wrong."}`;
    }
  } catch (err) {
    console.error("Add course error:", err);
    document.querySelector("#error").innerHTML = "Error adding course. Please try again.";
  }
}
