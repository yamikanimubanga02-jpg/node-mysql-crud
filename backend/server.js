const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. GET /api/timetable -> List all records
app.get('/api/timetable', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM timetable ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET /api/timetable/:id -> Get single record
app.get('/api/timetable/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM timetable WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Record not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST /api/timetable -> Create a record
app.post('/api/timetable', async (req, res) => {
    const { course_code, course_name, day_of_week, start_time, target_grade } = req.body;
    if (!course_code || !course_name) {
        return res.status(400).json({ error: 'course_code and course_name are required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO timetable (course_code, course_name, day_of_week, start_time, target_grade) VALUES (?, ?, ?, ?, ?)',
            [course_code, course_name, day_of_week, start_time, target_grade]
        );
        res.status(201).json({ id: result.insertId, message: 'Record created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT /api/timetable/:id -> Update a record
app.put('/api/timetable/:id', async (req, res) => {
    const { course_code, course_name, day_of_week, start_time, target_grade } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE timetable SET course_code=?, course_name=?, day_of_week=?, start_time=?, target_grade=? WHERE id=?',
            [course_code, course_name, day_of_week, start_time, target_grade, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE /api/timetable/:id -> Delete a record
app.delete('/api/timetable/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM timetable WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});