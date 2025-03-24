const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  qualifications: {
    type: [String], // Array to store multiple qualifications
    required: true,
  },
  experience: {
    type: Number, // Number of years of experience
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  availability: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  regDate: {
    type: Date,
    default: Date.now,
  },
  
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
