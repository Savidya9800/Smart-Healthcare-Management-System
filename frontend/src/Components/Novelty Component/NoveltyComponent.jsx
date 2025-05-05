import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeartModelViewer from "./HeartModel/HeartModelViewer";

const NoveltyComponent = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const navigate = useNavigate();

  // Symptom options grouped by category with associated icons
  const symptomCategories = {
    "Chest & Heart": [
      { name: "Chest Pain", icon: "❤️" },
      { name: "Shortness of Breath", icon: "🫁" },
      { name: "Racing Heart", icon: "💓" },
      { name: "Left Arm Pain", icon: "💪" },
      { name: "Jaw Pain", icon: "🦷" },
      { name: "Sweating", icon: "💦" },
    ],
    Digestive: [
      { name: "Nausea", icon: "🤢" },
      { name: "Vomiting", icon: "🤮" },
      { name: "Stomach Pain", icon: "🔥" },
      { name: "Bloating", icon: "⭕" },
      { name: "Heartburn", icon: "🔥" },
      { name: "Loss of Appetite", icon: "🍽️" },
      { name: "Regurgitation", icon: "↩️" },
      { name: "Difficulty Swallowing", icon: "👅" },
    ],
    Neurological: [
      { name: "Dizziness", icon: "💫" },
      { name: "Fainting", icon: "😵" },
      { name: "Headache", icon: "🧠" },
      { name: "Confusion", icon: "❓" },
      { name: "Blurred Vision", icon: "👁️" },
    ],
    Respiratory: [
      { name: "Coughing", icon: "😷" },
      { name: "Coughing Blood", icon: "🩸" },
      { name: "Wheezing", icon: "🌬️" },
      { name: "Sudden Shortness of Breath", icon: "😮‍💨" },
    ],
  };

  // Category background gradients and icons
  const categoryThemes = {
    "Chest & Heart": {
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)",
      icon: "❤️",
      iconSize: "text-4xl",
    },
    Digestive: {
      gradient: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
      icon: "🍽️",
      iconSize: "text-4xl",
    },
    Neurological: {
      gradient: "linear-gradient(135deg, #B721FF 0%, #21D4FD 100%)",
      icon: "🧠",
      iconSize: "text-4xl",
    },
    Respiratory: {
      gradient: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
      icon: "🫁",
      iconSize: "text-4xl",
    },
  };

  // Create an array of section names for easier navigation
  const sectionNames = Object.keys(symptomCategories);
  
  // Helper functions for section navigation
  const goToNextSection = () => {
    if (currentSectionIndex < sectionNames.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      // If we're at the last section, proceed to analysis with animation
      setLoading(true);
      submitAnalysis();
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Get current section name
  const currentSectionName = sectionNames[currentSectionIndex];
  const currentSectionSymptoms = symptomCategories[currentSectionName]?.map(s => s.name) || [];
  const currentTheme = categoryThemes[currentSectionName];

  const handleToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    setShowAllSymptoms(true);
  };

  const submitAnalysis = async () => {
    try {
      // Simulating API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch(
        "http://localhost:5000/api/novelty/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symptoms: selectedSymptoms }),
        }
      );

      const data = await response.json();
      const result = data.prediction || "No result";

      setPrediction(result);
      localStorage.setItem("lastPrediction", result);

      const lower = result.toLowerCase();
      if (lower.includes("heart attack") || lower.includes("critical")) {
        setSeverity("high");
      } else if (lower.includes("anxiety") || lower.includes("medium")) {
        setSeverity("medium");
      } else {
        setSeverity("low");
      }
    } catch (err) {
      console.error(err);
      setPrediction("Error analyzing symptoms. Try again later.");
      setSeverity("unknown");
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    high: "#e6317d",
    medium: "#FFC107",
    low: "#2fb297",
    unknown: "#828487",
  };

  const renderSeverityIndicator = () => {
    if (!severity) return null;

    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mt-6 mb-4"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              `0 0 15px ${severityColors[severity]}`,
              `0 0 25px ${severityColors[severity]}`,
              `0 0 15px ${severityColors[severity]}`
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative flex items-center justify-center w-24 h-24 transition-all duration-500 bg-white rounded-full"
          style={{
            border: `6px solid ${severityColors[severity]}`,
          }}
        >
          {severity === "high" ? (
            <span className="text-4xl">⚠️</span>
          ) : severity === "medium" ? (
            <span className="text-4xl">⚠️</span>
          ) : (
            <span className="text-4xl">✅</span>
          )}
        </motion.div>
        <motion.h6
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-xl font-bold"
          style={{ color: severityColors[severity] }}
        >
          {severity === "high"
            ? "High Risk"
            : severity === "medium"
            ? "Medium Risk"
            : "Low Risk"}
        </motion.h6>
      </motion.div>
    );
  };

  // Get flattened list of symptom names
  const allSymptomNames = Object.values(symptomCategories).flat().map(s => s.name);
  const totalSymptoms = allSymptomNames.length;
  const selectedCount = selectedSymptoms.length;

  return (
    <div 
      className="relative flex flex-col items-center min-h-screen px-4 py-10"
      style={{
        background: "radial-gradient(circle, #f0f4ff 0%, #e3eaff 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-40 h-40 bg-pink-200 rounded-full -top-10 -left-10 opacity-20 animate-blob"></div>
          <div className="absolute bg-blue-200 rounded-full top-20 right-20 w-60 h-60 opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute w-40 h-40 bg-green-200 rounded-full bottom-20 left-1/3 opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Previous Button - Top Left */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="absolute flex items-center px-3 py-2 text-gray-700 transition-colors bg-white rounded-full shadow-md top-4 left-4 hover:text-pink-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </motion.button>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-rose-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
          AI Symptom Analyzer
        </h1>
        <p className="max-w-lg text-center text-gray-600">
          Select all symptoms you're experiencing for personalized analysis
        </p>
      </motion.div>

      {/* Main Content */}
      {prediction ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl overflow-hidden bg-white shadow-xl rounded-xl"
        >
          <div className="p-8">
            {renderSeverityIndicator()}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="my-8 overflow-hidden border border-gray-100 rounded-lg shadow-lg"
            >
              <HeartModelViewer affectedSymptoms={selectedSymptoms} />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Analysis Result
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 text-lg text-gray-700"
            >
              {prediction}
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6"
            >
              <button
                className="px-4 py-2 mr-3 text-gray-700 transition-all border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Details" : "View Details"}
              </button>
            </motion.div>

            <AnimatePresence>
              {showDetails && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-hidden"
                >
                  <hr className="my-4" />
                  <p className="mb-2 text-sm text-gray-500">
                    Reported Symptoms ({selectedCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSymptoms.map((symptom) => (
                      <motion.span
                        key={symptom}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-3 py-1 text-sm rounded-full shadow-sm"
                        style={{
                          backgroundColor:
                            severity === "high"
                              ? "rgba(230, 49, 125, 0.1)"
                              : severity === "medium"
                              ? "rgba(255, 193, 7, 0.1)"
                              : "rgba(47, 178, 151, 0.1)",
                          color: severityColors[severity],
                        }}
                      >
                        {symptom}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/health-trends")}
                className="w-full px-6 py-3 font-medium text-white transition-all rounded-md shadow-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
              >
                Continue to Health Trends →
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <motion.div 
            className="overflow-hidden bg-white shadow-xl rounded-xl"
            layoutId="symptomCard"
          >
            <div className="p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>Progress</span>
                  <span>{selectedCount}/{totalSymptoms} symptoms</span>
                </div>
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(selectedCount / totalSymptoms) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                </div>
              </div>

              {!showAllSymptoms ? (
                <motion.div 
                  className="py-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-indigo-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-2xl font-medium text-gray-800">
                    Let's Check Your Symptoms
                  </h3>
                  <p className="mt-2 text-gray-600">
                    We'll help you identify possible health conditions based on
                    your symptoms
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-6 py-3 mt-6 font-medium text-white transition-all transform rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    Start Symptom Analysis
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {/* Section Progress Indicator */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className="text-lg font-medium"
                        style={{ color: severityColors.high }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={currentSectionIndex}
                      >
                        {currentSectionIndex + 1} of {sectionNames.length}: <span className="font-bold">{currentSectionName}</span>
                      </motion.div>
                      <div className="flex items-center">
                        {sectionNames.map((_, index) => (
                          <motion.div
                            key={index}
                            className={`w-3 h-3 mx-1 rounded-full ${
                              index === currentSectionIndex
                                ? "bg-gradient-to-r from-pink-500 to-purple-500"
                                : index < currentSectionIndex
                                ? "bg-indigo-300"
                                : "bg-gray-300"
                            }`}
                            whileHover={{ scale: 1.2 }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Category Header with Icon */}
                    <motion.div 
                      className="p-4 mb-4 rounded-lg shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      key={`category-${currentSectionName}`}
                      style={{
                        background: currentTheme.gradient
                      }}
                    >
                      <div className="flex items-center">
                        <span className={`${currentTheme.iconSize} mr-3`}>{currentTheme.icon}</span>
                        <h3 className="text-xl font-bold text-white">
                          {currentSectionName}
                        </h3>
                      </div>
                    </motion.div>
                  </div>

                  {/* Current Section Symptoms */}
                  <div className="mb-6">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentSectionIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                      >
                        {symptomCategories[currentSectionName].map((symptomObj) => (
                          <motion.div
                            key={symptomObj.name}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleToggle(symptomObj.name)}
                            className={`flex items-center p-3 space-x-3 transition-all border rounded-lg cursor-pointer ${
                              selectedSymptoms.includes(symptomObj.name)
                                ? "border-pink-500 bg-pink-50 shadow-sm"
                                : "border-gray-200 hover:border-pink-200 hover:bg-pink-50/30"
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-8 h-8 text-lg rounded-full ${
                                selectedSymptoms.includes(symptomObj.name)
                                  ? "bg-pink-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {symptomObj.icon}
                            </div>
                            <span className={`${
                              selectedSymptoms.includes(symptomObj.name)
                                ? "font-medium text-pink-900"
                                : "text-gray-700"
                            }`}>
                              {symptomObj.name}
                            </span>
                            <div className="flex-grow"></div>
                            <div
                              className={`w-6 h-6 border rounded-md ${
                                selectedSymptoms.includes(symptomObj.name)
                                  ? "bg-pink-500 border-pink-500"
                                  : "border-gray-300"
                              } flex items-center justify-center`}
                            >
                              {selectedSymptoms.includes(symptomObj.name) && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Section Navigation Buttons */}
                  <motion.div 
                    className="flex justify-between mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {currentSectionIndex > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToPreviousSection}
                        className="flex items-center px-4 py-2 text-gray-700 transition-all border border-gray-300 rounded-lg shadow hover:bg-gray-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Previous
                      </motion.button>
                    ) : (
                      <div>{/* Empty div for spacing */}</div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToNextSection}
                      className="flex items-center px-5 py-2 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    >
                      {currentSectionIndex < sectionNames.length - 1 ? (
                        <>
                          Next Section
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Analyze Symptoms
                          {loading ? (
                            <svg className="w-5 h-5 ml-3 -mr-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 ml-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          )}
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Tips Card */}
          {showAllSymptoms && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 mt-6 border border-blue-100 rounded-lg shadow-sm bg-blue-50"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Tip for accurate results</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    Select all symptoms you're experiencing, even if they seem minor or unrelated.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NoveltyComponent;
