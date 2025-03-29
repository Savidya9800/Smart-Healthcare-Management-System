const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel"); // Import user model
const { Router } = require("express");
const router = Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Or any email provider you're using
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (e.g., 'mygmail@gmail.com')
    pass: process.env.EMAIL_PASS, // Your Gmail password or App-specific password
  },
});

// Step 1: Request to reset password (send verification code)
router.post("/forgot-password", async (req, res) => {
  // console.log("Request received for reset password");
  const { email } = req.body;
  console.log("Email:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Save the reset token and expiration date to the user's profile
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();

    // Send email with the reset token
    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Error processing request. Please try again later." });
  }
});

// Step 2: Verify the reset token and reset password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Validate the reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // Hash the new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully updated" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Error resetting password. Please try again later." });
  }
});

// filepath: BACKEND/Routes/ForgotPasswordRoutes.js
module.exports = router;
