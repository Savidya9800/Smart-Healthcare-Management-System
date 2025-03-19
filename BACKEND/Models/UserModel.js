const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    trim: true,
    default: null, // Optional during registration
  },
  regDate: {
    type: Date,
    default: Date.now,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Not Specified"],
    default: "Not Specified", // Default value, required only during profile update
  },
  country: {
    type: String,
    trim: true,
    default: null, // Optional during registration
  },
  city: {
    type: String,
    trim: true,
    default: null, // Optional during registration
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Not Specified"],
    default: "Not Specified", // Default value, required only during profile update
  },
  dateOfBirth: {
    type: Date,
    default: null, // Optional during registration
  },
});

// Enforce required fields **ONLY during Profile Update**
userSchema.pre("save", function (next) {
  if (
    !this.mobile ||
    !this.bloodGroup ||
    !this.country ||
    !this.city ||
    !this.gender ||
    !this.dateOfBirth
  ) {
    if (
      this.isModified("mobile") ||
      this.isModified("bloodGroup") ||
      this.isModified("country") ||
      this.isModified("city") ||
      this.isModified("gender") ||
      this.isModified("dateOfBirth")
    ) {
      return next(
        new Error("All profile fields must be filled before saving.")
      );
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
