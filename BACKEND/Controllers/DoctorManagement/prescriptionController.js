const Prescription = require("../../Models/DoctorManagement/prescriptionModel");

// Get All Prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email") // Add email to the populated fields
      .sort("-dateIssued");
    res.status(200).json(prescriptions);
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get Prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("doctorId", "name specialization") // Add this populate
      .populate("patientId", "name email"); // Add this populate

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json(prescription);
  } catch (err) {
    console.error("Error fetching prescription:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create Prescription
const createPrescription = async (req, res) => {
  console.log(req.body);
  const { patientId, doctorId, appointmentId, medicine, notes } = req.body;

  try {
    const newPrescription = new Prescription({
      patientId,
      doctorId,
      appointmentId,
      medicine, // Expecting an array of medicine objects
      notes,
    });

    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Void Prescription (Mark as invalid but keep record)
const voidPrescription = async (req, res) => {
  try {
    const { voidReason } = req.body;
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Mark the prescription as voided
    prescription.isVoided = true;
    prescription.voidReason = voidReason || "No reason provided";

    await prescription.save();
    res.status(200).json({ message: "Prescription voided", prescription });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Correct Prescription (Creates a new prescription linked to the old one)
const correctPrescription = async (req, res) => {
  try {
    const oldPrescription = await Prescription.findById(req.params.id);

    if (!oldPrescription) {
      return res
        .status(404)
        .json({ message: "Original prescription not found" });
    }

    // Mark the old prescription as voided
    oldPrescription.isVoided = true;
    oldPrescription.voidReason = "Corrected by a new prescription";
    await oldPrescription.save();

    // Create a new corrected prescription
    const { patientId, doctorId, appointmentId, medicine, notes } = req.body;
    const newPrescription = new Prescription({
      patientId,
      doctorId,
      appointmentId,
      medicine,
      notes,
      correctedBy: oldPrescription._id,
    });

    await newPrescription.save();
    res
      .status(201)
      .json({ message: "New prescription issued", newPrescription });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Prescription
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Export Controllers
exports.getAllPrescriptions = getAllPrescriptions;
exports.getPrescriptionById = getPrescriptionById;
exports.createPrescription = createPrescription;
exports.voidPrescription = voidPrescription;
exports.correctPrescription = correctPrescription;
exports.deletePrescription = deletePrescription;
