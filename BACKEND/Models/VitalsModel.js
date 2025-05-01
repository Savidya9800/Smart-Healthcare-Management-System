const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bp: Number,           // Blood Pressure
  pulse: Number,        // Pulse Rate
  sugar: Number,        // Blood Sugar
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vitals", vitalsSchema);