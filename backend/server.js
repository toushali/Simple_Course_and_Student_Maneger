require('dotenv').config();
const express = require('express');

// Middleware
const requestLogger = require('./src/middleware/logger');
const rateLimit    = require('./src/middleware/rateLimit');
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const studentRoutes    = require('./src/routes/studentRoutes');
const courseRoutes     = require('./src/routes/courseRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');

const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 3000;

// ---------- Global middleware (order matters) ----------
app.use(express.json());     // 1. Parse JSON request bodies
app.use(requestLogger);      // 2. Log every request
app.use(rateLimit);          // 3. Rate-limit per IP

// ---------- Routes ----------
app.get('/', (req, res) => res.json({ status: 'API running' }));
app.use('/students',    studentRoutes);
app.use('/courses',     courseRoutes);
app.use('/enrollments', enrollmentRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ---------- Global error handler (must be last) ----------
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});