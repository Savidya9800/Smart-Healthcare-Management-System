const Vitals = require("../Models/VitalsModel");

// Save a vitals record
const saveVitals = async (req, res) => {
  try {
    const { bp, pulse, sugar } = req.body;
    const userId = req.user.id;
    const newVitals = await Vitals.create({ userId, bp, pulse, sugar });
    res.status(201).json(newVitals);
  } catch (err) {
    res.status(500).json({ message: "Error saving vitals", error: err });
  }
};

// Get all vitals for current user
const getUserVitals = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Vitals.find({ userId }).sort({ createdAt: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vitals", error: err });
  }
};

module.exports = { saveVitals, getUserVitals };