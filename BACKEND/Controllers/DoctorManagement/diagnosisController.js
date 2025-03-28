const Diagnosis = require("../../Models/DoctorManagement/diagnosisModel");

// Get all diagnoses
const getAllDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find();
    res.status(200).json(diagnoses);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get diagnosis by ID
const getDiagnosisById = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }
    res.status(200).json(diagnosis);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create diagnosis
const createDiagnosis = async (req, res) => {
  const { appointmentId, patientId, doctorId, symptoms, assumedIllness, diagnosisDescription, notes } = req.body;

  try {
    const newDiagnosis = new Diagnosis({
      appointmentId,
      patientId,
      doctorId,
      symptoms,
      assumedIllness,
      diagnosisDescription,
      notes,
    });

    await newDiagnosis.save();
    res.status(201).json(newDiagnosis);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update diagnosis status
const updateDiagnosisStatus = async (req, res) => {
  const { status } = req.body;

  // Ensure the status is one of the allowed values
  if (!["Pending", "Diagnosed", "Reviewed", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    diagnosis.status = status; // Set the new status
    await diagnosis.save();

    res.status(200).json({ message: "Diagnosis status updated", diagnosis });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete diagnosis
const deleteDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findByIdAndDelete(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.status(200).json({ message: "Diagnosis deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Export Controllers
exports.getAllDiagnoses = getAllDiagnoses;
exports.getDiagnosisById = getDiagnosisById;
exports.createDiagnosis = createDiagnosis;
exports.updateDiagnosisStatus = updateDiagnosisStatus;
exports.deleteDiagnosis = deleteDiagnosis;
