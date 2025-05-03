import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeartModelViewer from "./HeartModel/HeartModelViewer";

const NoveltyComponent = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize

  // Symptom options grouped by category
  const symptomCategories = {
    "Chest & Heart": [
      "Chest Pain",
      "Shortness of Breath",
      "Racing Heart",
      "Left Arm Pain",
      "Jaw Pain",
      "Sweating",
    ],
    Digestive: [
      "Nausea",
      "Vomiting",
      "Stomach Pain",
      "Bloating",
      "Heartburn",
      "Loss of Appetite",
      "Regurgitation",
      "Difficulty Swallowing",
    ],
    Neurological: [
      "Dizziness",
      "Fainting",
      "Headache",
      "Confusion",
      "Blurred Vision",
    ],
    Respiratory: [
      "Coughing",
      "Coughing Blood",
      "Wheezing",
      "Sudden Shortness of Breath",
    ],
  };

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
    setLoading(true);
    try {
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
      } else if (lower.includes("gastritis") || lower.includes("low")) {
        setSeverity("low");
      } else {
        setSeverity("unknown");
      }

      setTimeout(() => {}, 2000); // 2-second delay to show results
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
      <div className="flex flex-col items-center justify-center mt-8 mb-4">
        <div
          className="relative flex items-center justify-center w-24 h-24 transition-all duration-500 bg-white rounded-full"
          style={{
            border: `8px solid ${severityColors[severity]}`,
            boxShadow: `0 0 20px ${severityColors[severity]}`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12"
            style={{
              color: severityColors[severity],
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h6
          className="mt-2 text-lg font-bold"
          style={{ color: severityColors[severity] }}
        >
          {severity === "high"
            ? "High Risk"
            : severity === "medium"
            ? "Medium Risk"
            : "Low Risk"}
        </h6>
      </div>
    );
  };

  const totalSymptoms = Object.values(symptomCategories).flat().length;
  const selectedCount = selectedSymptoms.length;

  return (
    <div className="relative min-h-screen px-2 py-4">
      
      <div className="max-w-2xl p-4 mx-auto">
        
        <div className="mb-8 text-center">
          
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-pink-100 rounded-full">
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-pink-600"
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
          <h1 className="text-3xl font-bold text-indigo-900">
            AI Symptom Analyzer
          </h1>
          <p className="mt-2 text-gray-500">
            Select all symptoms you're experiencing for personalized analysis
          </p>
          
        </div>
        
        <p className="mt-4 text-lg">{prediction}</p>
        {prediction ? (
          <div className="mb-8 text-center">
            {renderSeverityIndicator()}
            {/* ✅ 3D Heart Model */}
            <div className="my-8 overflow-hidden border border-gray-100 rounded-lg shadow-lg">
              <HeartModelViewer affectedSymptoms={selectedSymptoms} />
            </div>
            <div className="relative p-6 overflow-hidden bg-white shadow-lg rounded-xl">
              <h2 className="mb-2 text-xl font-semibold">Analysis Result</h2>
              <p className="mt-4 text-lg">{prediction}</p>

              <div className="mt-6">
                <button
                  className="px-4 py-2 mr-3 border border-gray-300 rounded-lg"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "View Details"}
                </button>
                <button
                  className="px-4 py-2 text-white bg-indigo-900 rounded-lg hover:bg-indigo-800"
                  onClick={() => {
                    setPrediction("");
                    setSeverity(null);
                  }}
                >
                  Start New Analysis
                </button>
              </div>

              {showDetails && (
                <div className="mt-6">
                  <hr className="my-4" />
                  <p className="mb-2 text-sm text-gray-500">
                    Reported Symptoms ({selectedCount})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-2 py-1 text-sm rounded-full"
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
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Optional Next Step button */}
              <div className="mt-6">
                <button
                  onClick={() => navigate("/health-trends")}
                  className="px-6 py-2 mt-4 text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
                >
                  Continue to Health Trends →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="overflow-hidden bg-white shadow-lg rounded-xl">
              <div className="p-6">
                <p className="mb-4 text-sm text-gray-500">
                  Selected: {selectedCount}/{totalSymptoms} symptoms
                </p>

                {!showAllSymptoms ? (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-blue-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-blue-500"
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
                    <h3 className="text-xl font-medium text-gray-700">
                      Click "Analyze Symptoms" to Begin
                    </h3>
                    <p className="mt-2 text-gray-500">
                      We'll help you identify possible health conditions based
                      on your symptoms
                    </p>
                  </div>
                ) : (
                  <>
                    {Object.entries(symptomCategories).map(
                      ([category, symptoms]) => (
                        <div key={category} className="mb-6">
                          <h3 className="mb-2 text-lg font-semibold text-indigo-900">
                            {category}
                          </h3>
                          <hr className="mb-4" />
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {symptoms.map((symptom) => (
                              <div
                                key={symptom}
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => handleToggle(symptom)}
                              >
                                <div
                                  className={`h-5 w-5 border rounded ${
                                    selectedSymptoms.includes(symptom)
                                      ? "bg-pink-600 border-pink-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedSymptoms.includes(symptom) && (
                                    <svg
                                      className="w-5 h-5 text-white"
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
                                <span>{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              {!showAllSymptoms ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 text-base font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700"
                >
                  Analyze Symptoms
                </button>
              ) : (
                <button
                  onClick={submitAnalysis}
                  disabled={selectedCount === 0 || loading}
                  className={`px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-medium text-base ${
                    selectedCount === 0 || loading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? (
                    <svg
                      className="w-5 h-5 mx-auto text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Submit Analysis"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoveltyComponent;
