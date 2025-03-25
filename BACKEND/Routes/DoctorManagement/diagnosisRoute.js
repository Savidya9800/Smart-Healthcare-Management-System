const express = require("express");
const router = express.Router();

const {
  getAllDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosisStatus,
  deleteDiagnosis,
} = require("../../Controllers/DoctorManagement/diagnosisController");

// Get all diagnoses
router.get("/", getAllDiagnoses);

// Get diagnosis by ID
router.get("/:id", getDiagnosisById);

// Create diagnosis
router.post("/", createDiagnosis);

// Update diagnosis status (approve/reject)
router.put("/:id", updateDiagnosisStatus);

// Delete diagnosis
router.delete("/:id", deleteDiagnosis);

module.exports = router;
