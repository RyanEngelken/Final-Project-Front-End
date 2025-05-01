async function loadCourses() {
    try {
        const response = await fetch('http://localhost:3000/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const courses = await response.json();

        const container = document.getElementById('courses-container');
        container.innerHTML = '<p>Loading courses...</p>';

        if (courses.length === 0) {
            container.innerHTML = '<p>No courses available.</p>';
            return;
        }

        container.innerHTML = '';
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';

    card.innerHTML = `
    Course Name<h2>${course.courseName}</h2>
    <div class="course-info">Course ID: ${course.courseId}</div>
    <div class="course-info">Instructor: ${course.instructor}</div>
    <div class="card-buttons">
        <button class="btn edit-btn" data-course='${JSON.stringify(course)}'>Edit</button>
        <button class="btn delete-btn" data-id="${course._id}">Delete</button>
    </div>
`;


            container.appendChild(card);
        });

        attachButtonListeners();
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('courses-container').innerHTML = '<p>Error loading courses. Please try again.</p>';
    }
}

function attachButtonListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async function () {
        const courseId = this.dataset.id;
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Course deleted successfully!');
                    loadCourses(); 
                } else {
                    alert('Failed to delete course.');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting course.');
            }
        }
    });
});

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const course = JSON.parse(this.dataset.course);
            openEditModal(course);
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
    document.getElementById('location').value = course.location;
    document.getElementById('dayOfWeek').value = course.dayOfWeek;

    editModal.style.display = 'block';
}

closeModal.onclick = function() {
    editModal.style.display = 'none';
};

window.onclick = function(event) {
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
        location: document.getElementById('location').value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCourse)
        });

        if (response.ok) {
            alert('Course updated successfully!');
            editModal.style.display = 'none';  
            loadCourses(); 
        } else {
            alert('Failed to update course.');
        }
    } catch (error) {
        console.error('Update error:', error);
        alert('Error updating course.');
    }
});

loadCourses();