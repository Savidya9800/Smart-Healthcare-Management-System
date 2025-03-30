const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appoinmentSchema = new Schema({
    indexno: { type: String, unique: true, },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
        patient_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // References the user (patient)
          default: null, // Set default to null if not provided

        },
    nic: {
        type: String,
        required: true,
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
       default: null, // Set default to null if not provided
    },
  
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: "Doctor", // References the doctor
    default: null, // Set default to null if not provided

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
        data: { type: Buffer, default: null }, // Stores binary image data
        contentType: { type: String, default: null }, // Stores image type (e.g., "image/png", "image/jpeg")
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed","Completed"],
        default: "Pending",
    },
});

module.exports = mongoose.model("Appoinment", appoinmentSchema);
