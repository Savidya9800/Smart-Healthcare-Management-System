const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Import Routes
const userRoutes = require("./Routes/UserRoutes");  // User Management Routes
const authRoutes = require("./Routes/authRoutes");  // Authentication Routes
const appoinmentRoute = require("./Routes/AppoinmentRoutes");// Appoinment Route
const doctorRoute = require("./Routes/DoctorManagement/doctorRoute");// Doctor Route
const router = require("./Routes/StockRoutes");


const app = express();//initialize express application

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes); //  Routes for Login/Register
app.use("/api/users", userRoutes); //  Routes for User CRUD
app.use("/api/appoinment",appoinmentRoute);
app.use("/api/doctor",doctorRoute); // Routes for Doctor Management
app.use("/api/stock",router); // Routes for Stock Management

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
