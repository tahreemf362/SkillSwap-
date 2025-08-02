const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// ✅ Test route first
router.get('/test', (req, res) => {
  res.send('Dashboard route working');
});

// GET current user's skills
router.get('/my-skills', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query("SELECT * FROM skills WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    res.json(results);
  });
});

// ADD new skill
router.post('/add-skill', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { skill_name } = req.body;

  db.query("INSERT INTO skills (user_id, skill_name) VALUES (?, ?)", [userId, skill_name], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    res.json({ message: "Skill Added" });
  });
});

// GET other users’ skills
router.get('/all-skills', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query(`
    SELECT users.username, skills.skill_name 
    FROM skills 
    JOIN users ON skills.user_id = users.id 
    WHERE users.id != ?
  `, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    res.json(results);
  });
});

module.exports = router;  // ✅ must export router
