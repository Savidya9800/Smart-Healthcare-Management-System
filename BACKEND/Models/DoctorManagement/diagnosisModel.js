const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diagnosisSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",  // References the appointment associated with the diagnosis
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the patient
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // References the doctor providing the diagnosis
      required: true,
    },
    symptoms: {
      type: [String],  // Array of symptoms
    },
    assumedIllness: {
      type: String,  // Assumed illness based on symptoms
    },
    diagnosisDescription: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Diagnosed", "Reviewed", "Completed"],
      default: "Pending", // Default status is Pending
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diagnosis", diagnosisSchema);
