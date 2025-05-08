const express = require("express");
const router = express.Router();
const { saveVitals, getUserVitals } = require("../Controllers/VitalsController");
const verifyToken = require("../Middleware/authMiddleware");

router.post("/save", verifyToken, saveVitals);
router.get("/user", verifyToken, getUserVitals);

module.exports = router;