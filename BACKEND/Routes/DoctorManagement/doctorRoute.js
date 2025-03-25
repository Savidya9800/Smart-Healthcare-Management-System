const express = require("express");
const router = express.Router();
const {
  getDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../../Controllers/DoctorManagement/doctorController");
const authMiddleware = require("../../Middleware/authMiddleware");

router.get("/profile", authMiddleware, getDoctorProfile); // Protected Route
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;
