const express = require("express");
const router = express.Router();
const { analyzeSymptoms } = require("../Controllers/NoveltyController");

router.post("/analyze", analyzeSymptoms);

module.exports = router;
