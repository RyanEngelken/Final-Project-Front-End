addEventListener("DOMContentLoaded", function () {
    document.querySelector("#addBtn").addEventListener("click", addCourse);
});

async function addCourse(event) {
    event.preventDefault();

    const course = {
        courseName: document.querySelector("#courseName").value,
        courseDescription: document.querySelector("#courseDescription").value,
        instructor: document.querySelector("#instructor").value,
        courseId: document.querySelector("#courseId").value,
        dayOfWeek: document.querySelector("#dayOfWeek").value,
        timeOfClass: document.querySelector("#timeOfClass").value,
        location: document.querySelector("#location").value
    };

    const response = await fetch("https://selective-garnet-discovery.glitch.me/api/courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(course)
    });

    if (response.ok) {
        const results = await response.json();
        alert("Course added successfully!"); 
        document.querySelector("#addCourseForm").reset(); 
    } else {
        document.querySelector("#error").innerHTML = "Error adding course. Please try again."; 
    }
}