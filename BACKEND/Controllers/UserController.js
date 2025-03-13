const mongoose = require("mongoose");
const User = require("../Models/UserModel");

// Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id); // Debugging line 

    const user = await User.findById(mongoose.Types.ObjectId(req.user.id)).select("-password");

    if (!user) {
      console.log("User not found in database"); // Debugging line 
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
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User by ID
const getById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update User
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, mobile, bloodGroup, country, city, gender, dateOfBirth } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, mobile, bloodGroup, country, city, gender, dateOfBirth },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export Controllers
exports.getUserProfile = getUserProfile;
exports.getAllUsers = getAllUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
