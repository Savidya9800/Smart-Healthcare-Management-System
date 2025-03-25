const express = require("express");
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  voidPrescription,
  correctPrescription,
  deletePrescription
} = require("../../Controllers/DoctorManagement/prescriptionController");

router.get("/", getAllPrescriptions);
router.get("/:id", getPrescriptionById);
router.post("/", createPrescription);
router.put("/:id/void", voidPrescription); // Mark as void
router.post("/:id/correct", correctPrescription); // Create a corrected version
router.delete("/:id", deletePrescription);

module.exports = router;
