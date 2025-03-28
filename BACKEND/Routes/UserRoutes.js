const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
} = require("../Controllers/UserController");
const authMiddleware = require("../Middleware/authMiddleware");

// Protected Route to get logged-in user's profile
router.get("/profile", authMiddleware, getUserProfile);

// Get all users (admin use)
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getById);

// Update user by ID
router.put("/:id", updateUser);

// Delete currently logged-in user (uses token for ID)
router.delete("/delete", authMiddleware, deleteUser);

module.exports = router;
