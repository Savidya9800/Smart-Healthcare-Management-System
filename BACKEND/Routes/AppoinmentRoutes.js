const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  sendConfirmationEmail,
  rejectAppointment,
} = require("../Controllers/AppoinmentController");
const authMiddleware = require("../Middleware/authMiddleware");

// Create a new appointment (Protected)
router.post("/", authMiddleware, createAppointment);

// Get all appointments
router.get("/", getAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment by ID
router.put("/:id", updateAppointment);

// Delete appointment by ID
router.delete("/:id", deleteAppointment);

// Send confirmation email
router.post("/send-confirmation", sendConfirmationEmail);

// Reject appointment by ID (Protected)
router.post("/:id/reject", authMiddleware, rejectAppointment);

module.exports = router;