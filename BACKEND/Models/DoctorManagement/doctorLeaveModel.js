const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorLeaveSchema = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: "Doctor", // References the doctor
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Sick Leave", "Annual Leave", "Emergency Leave", "Other"], // Different types of leave
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Plan", "Taken", "Cancelled", "Ongoing"], // Updated status options
      default: "Plan", // Default status is "Plan"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DoctorLeave", doctorLeaveSchema);
