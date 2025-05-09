window.addEventListener('DOMContentLoaded', loadCourses);

// Function for enrolled courses
async function loadCourses() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('https://shared-slime-viola.glitch.me/api/courses?enrolled=true', {
      headers: {
        'x-auth': token
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = 'login.html';
        throw new Error('Unauthorized: Please log in again.');
      }
      throw new Error('Failed to fetch enrolled courses');
    }

    const courses = await response.json();
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';

    if (courses.length === 0) {
      coursesContainer.innerHTML = '<p>No courses enrolled.</p>';
      return;
    }

    const table = document.createElement('table');
    table.classList.add('schedule-table');

    table.innerHTML = `
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Course ID</th>
          <th>Instructor</th>
          <th>Day</th>
          <th>Time</th>
          <th>Credit Hours</th>
          <th>Subject</th>
          <th>Drop</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;

    const tbody = table.querySelector('tbody');
    courses.forEach(course => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${course.courseName}</td>
        <td>${course.courseId}</td>
        <td>${course.instructor}</td>
        <td>${course.dayOfWeek}</td>
        <td>${course.timeOfClass}</td>
        <td>${course.creditHours}</td>
        <td>${course.subjectArea}</td>
        <td><button class="drop-button" data-id="${course._id}">Drop</button></td>
      `;
      tbody.appendChild(row);
    });

    coursesContainer.appendChild(table);

    // Unenroll 
    document.querySelectorAll('.drop-button').forEach(button => {
      button.addEventListener('click', async function() {
        const courseId = this.dataset.id;
        if (confirm('Are you sure you want to drop this course?')) {
          try {
            const response = await fetch(`https://shared-slime-viola.glitch.me/api/courses/${courseId}/drop`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-auth': token
              }
            });

            const result = await response.json();
            if (response.ok) {
              alert('Successfully dropped the course!');
              loadCourses();
            } else {
              alert(`Error: ${result.message || 'Failed to drop course'}`);
            }
          } catch (error) {
            console.error('Drop error:', error);
            alert('Error dropping course.');
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading enrolled courses:', error);
    document.getElementById('courses-container').innerHTML = `<p>${error.message || 'Error loading schedule. Please try again.'}</p>`;
  }
}