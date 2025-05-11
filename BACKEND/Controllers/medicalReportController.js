const MedicalReport = require("../Models/MedicalReport"); // Adjust the path as necessary
const fs = require("fs");
const path = require("path");

exports.uploadReport = async (req, res) => {
  try {
    const newReport = new MedicalReport({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ userId: req.user.id });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports", error: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    fs.unlinkSync(path.resolve(report.filePath));
    await report.deleteOne();
    res.status(200).json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete report", error: err.message });
  }
};
