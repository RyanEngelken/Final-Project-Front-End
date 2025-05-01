document.addEventListener('DOMContentLoaded', function() {
    const coursesContainer = document.getElementById('courses-container');
    
    fetch('https://selective-garnet-discovery.glitch.me/api/courses')
        .then(response => response.json())
        .then(courses => {
            courses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.classList.add('course-card');
                
                courseCard.innerHTML = `
                    <h2 class="course-name">${course.courseName}</h2>
                    <p class="course-description">${course.courseDescription}</p>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p><strong>Course ID:</strong> ${course.courseId}</p>
                    <p><strong>Day:</strong> ${course.dayOfWeek}</p>
                    <p><strong>Time:</strong> ${course.timeOfClass}</p>
                    <p><strong>Location:</strong> ${course.location}</p>
                    <button class="enroll-button" data-id="${course._id}">Enroll</button>
                `;
                
                coursesContainer.appendChild(courseCard);
            });
        })
        .catch(error => console.error('Error loading courses:', error));
});