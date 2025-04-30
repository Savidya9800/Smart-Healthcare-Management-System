// Routes/NoveltyRoutes.js
const express = require('express');
const router = express.Router();

// Import the NoveltyController
const noveltyController = require('../Controllers/NoveltyController');

// POST route to analyze symptoms and predict disease
router.post('/analyze-symptoms', noveltyController.analyzeSymptoms);

module.exports = router;
