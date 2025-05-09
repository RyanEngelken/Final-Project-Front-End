document.addEventListener('DOMContentLoaded', function() {
  const coursesContainer = document.getElementById('courses-container');
  const token = localStorage.getItem('token');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Fetch and display courses
  function fetchCourses(searchTerm = '') {
    const url = searchTerm
      ? `https://shared-slime-viola.glitch.me/api/courses?search=${encodeURIComponent(searchTerm)}`
      : 'https://shared-slime-viola.glitch.me/api/courses';

    fetch(url, {
      headers: {
        'x-auth': token
      }
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = 'login.html';
            throw new Error('Unauthorized: Please log in again.');
          }
          throw new Error('Failed to fetch courses');
        }
        return response.json();
      })
      .then(courses => {
        coursesContainer.innerHTML = '';
        if (courses.length === 0) {
          coursesContainer.innerHTML = '<p>No courses found.</p>';
          return;
        }
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
            <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
            <p><strong>Subject Area:</strong> ${course.subjectArea}</p>
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
              const response = await fetch(`https://shared-slime-viola.glitch.me/api/courses/${courseId}/enroll`, {
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
        coursesContainer.innerHTML = `<p>${error.message || 'Error loading courses. Please try again.'}</p>`;
      });
  }

  // Handle search form submission
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length > 100) {
      alert('Search term is too long.');
      return;
    }
    fetchCourses(searchTerm);
  });

  // Handle clear search
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    fetchCourses();
  });

  // Initial load of all courses
  fetchCourses();
});