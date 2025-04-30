// Controllers/NoveltyController.js
const analyzeSymptoms = (req, res) => {
  const symptoms = req.body.symptoms; // Get symptoms from request body

  let disease = '';

  // Prediction logic based on symptoms
  if (symptoms.includes('Chest Pain') && symptoms.includes('Shortness of Breath')) {
    disease = 'Heart Attack';
  } else if (symptoms.includes('Stomach Pain') && symptoms.includes('Bloating') && symptoms.includes('Heartburn')) {
    disease = 'Gastritis';
  } else if (symptoms.includes('Leg Pain') && symptoms.includes('Cold Sweats')) {
    disease = 'Peripheral Artery Disease';
  } else {
    disease = 'Low Risk'; // Default to Low Risk
  }

  // Send the disease prediction as response
  res.json({ message: `Possible Condition: ${disease}` });
};

module.exports = { analyzeSymptoms };
