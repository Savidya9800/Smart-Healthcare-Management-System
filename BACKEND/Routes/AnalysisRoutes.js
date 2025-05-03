const express = require("express");
const router = express.Router();
const { saveAnalysis, getMyAnalyses } = require("../Controllers/AnalysisController");
const verifyToken  = require("../Middleware/authMiddleware");

router.post("/save", verifyToken, saveAnalysis);
router.get("/my-analyses", verifyToken, getMyAnalyses);

module.exports = router;