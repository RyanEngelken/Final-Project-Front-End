document.addEventListener('DOMContentLoaded', function() {
    const coursesContainer = document.getElementById('courses-container');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Shows all courses
    fetch('https://foremost-zinc-beat.glitch.me/api/courses', {
        headers: {
            'x-auth': token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            return response.json();
        })
        .then(courses => {
            coursesContainer.innerHTML = '';
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
                    <button class="enroll-button" data-id="${course._id}" ${course.enrolledUsers.includes(localStorage.getItem('userId')) ? 'disabled' : ''}>
                        ${course.enrolledUsers.includes(localStorage.getItem('userId')) ? 'Enrolled' : 'Enroll'}
                    </button>
                `;
                
                coursesContainer.appendChild(courseCard);
            });

            // Enroll 
            document.querySelectorAll('.enroll-button').forEach(button => {
                button.addEventListener('click', async function() {
                    const courseId = this.dataset.id;
                    try {
                        const response = await fetch(`https://foremost-zinc-beat.glitch.me/api/courses/${courseId}/enroll`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth': token
                            }
                        });

                        const result = await response.json();
                        if (response.ok) {
                            alert('Successfully enrolled in course!');
                            this.textContent = 'Enrolled';
                            this.disabled = true;
                        } else {
                            alert(`Error: ${result.message || 'Failed to enroll'}`);
                        }
                    } catch (error) {
                        console.error('Enroll error:', error);
                        alert('Error enrolling in course.');
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading courses:', error);
            coursesContainer.innerHTML = '<p>Error loading courses. Please try again.</p>';
        });
});