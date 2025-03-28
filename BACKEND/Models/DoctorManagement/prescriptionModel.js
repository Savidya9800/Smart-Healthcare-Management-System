const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the user (patient)
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // References the doctor
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", // References the appointment
      required: true,
    },
    medicine: [
      {
        medicineName: {
          type: String,
          trim: true,
        },
        dosage: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    dateIssued: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    isVoided: {
      type: Boolean,
      default: false,
    },
    voidReason: {
      type: String,
      trim: true,
    },
    correctedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription", // Links to a corrected prescription if created
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
