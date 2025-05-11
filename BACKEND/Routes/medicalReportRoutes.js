const express = require("express");
const router = express.Router();
const auth = require("../Middleware/authMiddleware");
const upload = require("../Middleware/upload");
const {
  uploadReport,
  getUserReports,
  deleteReport,
} = require("../Controllers/medicalReportController"); // FIXED PATH

router.post("/upload", auth, upload.single("report"), uploadReport);
router.get("/", auth, getUserReports);
router.delete("/:id", auth, deleteReport);

module.exports = router;
