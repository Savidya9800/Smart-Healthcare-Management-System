const mongoose = require("mongoose");

const rejectedAppointmentSchema = new mongoose.Schema({
  indexno: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "Rejected",
  },
  rejectionReason: {
    type: String,
    required: true,
  },
  rejectedAt: {
    type: Date,
    default: Date.now,
  },
  originalAppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
});

module.exports = mongoose.model("RejectedAppointment", rejectedAppointmentSchema);