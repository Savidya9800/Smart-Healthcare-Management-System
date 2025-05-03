const Analysis = require("../Models/AnalysisModel");

// Save analysis result
const saveAnalysis = async (req, res) => {
  try {
    const { symptoms, prediction } = req.body;
    const userId = req.user.id; // extracted from auth middleware

    const newRecord = await Analysis.create({
      userId,
      symptoms,
      prediction,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Error saving analysis", error });
  }
};

// Fetch all analysis history for current user
const getMyAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Analysis.find({ userId }).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching analysis history", error });
  }
};

module.exports = {
  saveAnalysis,
  getMyAnalyses,
};
