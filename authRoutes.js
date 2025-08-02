const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
require('dotenv').config();

// ✅ Test route to verify router works
router.get('/test', (req, res) => {
  res.send('Auth route working');
});

// ------------------- SIGNUP -------------------
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Use 'name' instead of 'username'
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: "DB Error" });
        res.status(200).json({ message: "User Registered" });
      }
    );
  });
});

// ------------------- LOGIN -------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.status(401).json({ message: "Wrong Password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: results[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Return 'name' as username for frontend compatibility
    res.json({
      token,
      user: { id: results[0].id, username: results[0].name }
    });
  });
});

module.exports = router; // ✅ Must export router
