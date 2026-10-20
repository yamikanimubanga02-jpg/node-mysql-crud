const API_URL = 'http://localhost:3000/api/timetable';

const form = document.getElementById('timetable-form');
const recordIdInput = document.getElementById('record-id');
const courseCodeInput = document.getElementById('course_code');
const courseNameInput = document.getElementById('course_name');
const dayOfWeekInput = document.getElementById('day_of_week');
const startTimeInput = document.getElementById('start_time');
const targetGradeInput = document.getElementById('target_grade');
const tbody = document.getElementById('timetable-tbody');
const submitBtn = document.getElementById('form-submit-btn');

document.addEventListener('DOMContentLoaded', fetchRecords);

async function fetchRecords() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        tbody.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.course_code}</td>
                <td>${item.course_name}</td>
                <td>${item.day_of_week}</td>
                <td>${item.start_time}</td>
                <td>${item.target_grade}</td>
                <td>
                    <button class="btn-edit" onclick="editRecord(${item.id}, '${item.course_code}', '${item.course_name}', '${item.day_of_week}', '${item.start_time}', '${item.target_grade}')">Edit</button>
                    <button class="btn-delete" onclick="deleteRecord(${item.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = recordIdInput.value;
    const payload = {
        course_code: courseCodeInput.value,
        course_name: courseNameInput.value,
        day_of_week: dayOfWeekInput.value,
        start_time: startTimeInput.value,
        target_grade: targetGradeInput.value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    form.reset();
    recordIdInput.value = '';
    submitBtn.textContent = 'Save Record';
    fetchRecords();
});

function editRecord(id, code, name, day, time, grade) {
    recordIdInput.value = id;
    courseCodeInput.value = code;
    courseNameInput.value = name;
    dayOfWeekInput.value = day;
    startTimeInput.value = time;
    targetGradeInput.value = grade;
    submitBtn.textContent = 'Update Record';
}

async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchRecords();
    }
}