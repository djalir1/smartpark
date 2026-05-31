require('dotenv').config();
const express = require('express');
const cors = require('cors');

// DB initialises on require
require('./config/db');

const authRoutes       = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes   = require('./routes/employeeRoutes');
const salaryRoutes     = require('./routes/salaryRoutes');
const reportRoutes     = require('./routes/reportRoutes');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health
app.get('/', (req, res) => {
  res.status(200).json({
    app: 'Smart Park EPMS API',
    status: 'running',
    time: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth',        authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees',   employeeRoutes);
app.use('/api/salaries',    salaryRoutes);
app.use('/api/reports',     reportRoutes);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found: ' + req.method + ' ' + req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({ message: 'Unexpected server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('================================================');
  console.log(' Smart Park EPMS API running on port ' + PORT);
  console.log(' http://localhost:' + PORT);
  console.log('================================================');
});