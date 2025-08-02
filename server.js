const dotenv = require('dotenv');
dotenv.config(); // ✅ Load .env first

const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ Required for correct path handling

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Debug logs to check .env values
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD === '' ? '(empty)' : process.env.DB_PASSWORD);

// ✅ Require routes (make sure files are not empty)
const authRoutes = require('./routes/authRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');

// ✅ Debug logs to confirm export type
console.log('AuthRoutes export type:', typeof authRoutes);
console.log('DashboardRoutes export type:', typeof dashboardRoutes);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Corrected public folder path (adjusted for folder structure)
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
