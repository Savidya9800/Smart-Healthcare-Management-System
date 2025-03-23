const mongoose = require("mongoose");
const User = require("../Models/UserModel");

// Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id); // Debugging

    // Fetch user using the ID extracted from JWT
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Users (Admin Use)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User by ID
const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update User Profile
const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      bloodGroup,
      country,
      city,
      gender,
      dateOfBirth,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, bloodGroup, country, city, gender, dateOfBirth },
      { new: true, runValidators: true } // Ensure validation is applied
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete User
// Delete User (Authenticated User)
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieved from token via authMiddleware

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export Controllers
module.exports = {
  getUserProfile,
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
};
