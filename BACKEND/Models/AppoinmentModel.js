const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appoinmentSchema = new Schema({
    indexno: { type: String, unique: true, required: true },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        default: 'Not provided',
        trim: true,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    nic: {
        type: String,
        default: 'Not provided',
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    doctorName: {
        type: String,
        default: 'Not specified',
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
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
    slip: {
        data: { type: Buffer, default: null },
        contentType: { type: String, default: null },
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Completed"],
        default: "Pending",
    },
});

module.exports = mongoose.model("Appoinment", appoinmentSchema);