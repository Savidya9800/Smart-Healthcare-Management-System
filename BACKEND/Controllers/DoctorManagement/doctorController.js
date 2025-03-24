const mongoose = require("mongoose");
const Doctor = require("../../Models/DoctorManagement/doctorModel");

// Get Doctor Profile by ID
const getDoctorProfile = async (req, res) => {
  try {
    console.log("Doctor ID from token:", req.user.id); // Debugging line

    const doctor = await Doctor.findById(mongoose.Types.ObjectId(req.user.id)).select("-password");

    if (!doctor) {
      console.log("Doctor not found in database"); // Debugging line
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error("Error fetching doctor profile:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Doctor by ID
const getDoctorById = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Doctor
const updateDoctor = async (req, res) => {
  const id = req.params.id;
  const { name, email, phone, specialization, qualifications, experience, address, availability, gender, dateOfBirth } = req.body;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { name, email, phone, specialization, qualifications, experience, address, availability, gender, dateOfBirth },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(updatedDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Doctor
const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export Controllers
exports.getDoctorProfile = getDoctorProfile;
exports.getAllDoctors = getAllDoctors;
exports.getDoctorById = getDoctorById;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
