// app.js

require('dotenv').config(); // Load environment variables at the very top
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Import configurations
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const customerRoutes = require('./routes/customerRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const matchRoutes = require('./routes/matchRoutes');
const miscRoutes = require('./routes/miscRoutes');


const app = express();

// CORS Configuration
app.use(cors({
  origin: config.corsOrigin,
  methods: config.corsMethods,
  credentials: true
}));

// Serve static files (images)
app.use(express.static(config.imagePathUrl));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For handling URL-encoded data

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/misc', miscRoutes);



// Centralized Error Handling Middleware (should be the last middleware)
app.use(errorHandler);

// Database Connection and Server Start
mongoose
  .connect(config.mongoURI)
  .then(() => {
    app.listen(config.port, config.host, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
    console.log("MongoDB connected...");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

module.exports = app;