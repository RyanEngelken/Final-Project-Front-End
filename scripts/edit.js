document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  // Checking for token, redirects to login page if no token
  if (!token || !userId) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
    return;
  }

  // Checking if role is teacher
  if (role !== 'teacher') {
    alert('Access denied: Teachers only.');
    window.location.href = 'index.html';
    return;
  }

  // Fetching all courses
  async function loadCourses() {
    try {
      const response = await fetch(`https://shared-slime-viola.glitch.me/api/courses?owner=${userId}`, {
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
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Invalid request');
        }
        throw new Error('Failed to fetch courses');
      }

      const courses = await response.json();
      const container = document.getElementById('courses-container');
      container.innerHTML = '';

      if (courses.length === 0) {
        container.innerHTML = '<p>No courses available.</p>';
        return;
      }

      courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';

        card.innerHTML = `
          <h2>${course.courseName}</h2>
          <div class="course-info">Course ID: ${course.courseId}</div>
          <div class="course-info">Instructor: ${course.instructor}</div>
        `;

        // Only show edit/delete buttons for teachers
        if (role === 'teacher') {
          const buttons = document.createElement('div');
          buttons.className = 'card-buttons';
          buttons.innerHTML = `
            <button class="btn edit-btn" data-id="${course._id}">Edit</button>
            <button class="btn delete-btn" data-id="${course._id}">Delete</button>
          `;
          card.appendChild(buttons);
        }

        container.appendChild(card);
      });

      attachButtonListeners();
    } catch (error) {
      console.error('Error loading courses:', error);
      document.getElementById('courses-container').innerHTML = `<p>${error.message || 'Error loading courses. Please try again.'}</p>`;
    }
  }

  // Delete
  function attachButtonListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async function () {
        const courseId = this.dataset.id;
        if (confirm('Are you sure you want to delete this course?')) {
          try {
            const response = await fetch(`https://shared-slime-viola.glitch.me/api/courses/${courseId}`, {
              method: 'DELETE',
              headers: {
                'x-auth': token
              }
            });

            if (response.ok) {
              alert('Course deleted successfully!');
              loadCourses();
            } else {
              const errorData = await response.json();
              alert(`Failed to delete course: ${errorData.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting course.');
          }
        }
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', async function () {
        const courseId = this.dataset.id;
        try {
          const response = await fetch(`https://shared-slime-viola.glitch.me/api/courses/${courseId}`, {
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
            throw new Error('Failed to fetch course details');
          }

          const course = await response.json();
          openEditModal(course);
        } catch (error) {
          console.error('Error fetching course:', error);
          alert(`Error: ${error.message || 'Failed to load course details'}`);
        }
      });
    });
  }

  const editModal = document.getElementById('editModal');
  const closeModal = document.querySelector('.close');
  const editForm = document.getElementById('editForm');

  function openEditModal(course) {
    document.getElementById('courseId').value = course._id;
    document.getElementById('courseName').value = course.courseName;
    document.getElementById('courseDescription').value = course.courseDescription;
    document.getElementById('instructor').value = course.instructor;
    document.getElementById('courseIdVisible').value = course.courseId;
    document.getElementById('timeOfClass').value = course.timeOfClass;
    document.getElementById('creditHours').value = course.creditHours;
    document.getElementById('dayOfWeek').value = course.dayOfWeek;
    document.getElementById('subjectArea').value = course.subjectArea;

    editModal.style.display = 'block';
  }

  if (closeModal) {
    closeModal.addEventListener('click', function () {
      editModal.style.display = 'none';
    });
  }

  window.onclick = function (event) {
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
  };

  editForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('courseId').value;
    const updatedCourse = {
      courseName: document.getElementById('courseName').value,
      courseDescription: document.getElementById('courseDescription').value,
      instructor: document.getElementById('instructor').value,
      courseId: document.getElementById('courseIdVisible').value,
      dayOfWeek: document.getElementById('dayOfWeek').value,
      timeOfClass: document.getElementById('timeOfClass').value,
      creditHours: document.getElementById('creditHours').value,
      subjectArea: document.getElementsByTagName(`subjectArea`).value
    };

    // Edit Post
    try {
      const response = await fetch(`https://shared-slime-viola.glitch.me/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth': token
        },
        body: JSON.stringify(updatedCourse)
      });

      if (response.ok) {
        alert('Course updated successfully!');
        editModal.style.display = 'none';
        loadCourses();
      } else {
        const errorData = await response.json();
        alert(`Failed to update course: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating course.');
    }
  });

  loadCourses();
});