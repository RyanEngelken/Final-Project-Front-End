window.addEventListener('DOMContentLoaded', loadCourses);

async function loadCourses() {
    const response = await fetch('http://localhost:3000/api/courses');
    const courses = await response.json();

    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';

    courses.forEach(course => {
        const div = document.createElement('div');
        div.classList.add('course-card'); 
        div.innerHTML = `
                   <h2 class="course-name">${course.courseName}</h2>
                    <p class="course-description">${course.courseDescription}</p>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p><strong>Course ID:</strong> ${course.courseId}</p>
                    <p><strong>Day:</strong> ${course.dayOfWeek}</p>
                    <p><strong>Time:</strong> ${course.timeOfClass}</p>
                    <p><strong>Location:</strong> ${course.location}</p>
        `;
        coursesContainer.appendChild(div);
    });
}
