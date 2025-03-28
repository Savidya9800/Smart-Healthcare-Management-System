const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Import Routes
const userRoutes = require("./Routes/UserRoutes"); // User Management Routes
const authRoutes = require("./Routes/authRoutes"); // Authentication Routes
const appointmentRoute = require("./Routes/AppoinmentRoutes"); // Appointment Route
const doctorRoute = require("./Routes/DoctorManagement/doctorRoute"); // Doctor Route
const stockRoute = require("./Routes/StockRoutes"); // Stock Route
const forgotPasswordRoute = require("./Routes/ForgotPasswordRoutes"); // Forgot Password Routes

const app = express(); // initialize express application

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes); // Routes for Login/Register
app.use("/api/users", userRoutes); // Routes for User CRUD
app.use("/api/appoinment", appointmentRoute); // Routes for Appointment Management
app.use("/api/doctor", doctorRoute); // Routes for Doctor Management
app.use("/api/stock", stockRoute); // Routes for Stock Management

// Forgot Password Routes
app.use("/api/auth/forgot-password", forgotPasswordRoute); // Routes for Forgot Password functionality

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Database connection error:", err));
