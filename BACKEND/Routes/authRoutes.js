const express = require("express");
const router = express.Router();
const { registerUser, loginUser,registerDoctor,loginDoctor } = require("../Controllers/AuthController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/register-doctor", registerDoctor);
router.post("/login-doctor", loginDoctor);


module.exports = router;
