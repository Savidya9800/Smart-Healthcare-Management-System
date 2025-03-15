const express = require("express");
const router = express.Router();
const { getUserProfile, getAllUsers, getById, updateUser, deleteUser } = require("../Controllers/UserController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/profile", authMiddleware, getUserProfile); // Protected Route
router.get("/", getAllUsers);
router.get("/:id", getById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
