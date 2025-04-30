// src/Components/NoveltyComponent/NoveltyComponent.jsx
import React, { useState } from "react";
import { Checkbox, FormControlLabel, Button } from "@mui/material";

const NoveltyComponent = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState("");
  const [resultClass, setResultClass] = useState(""); // For dynamic styling
  const [heartColor, setHeartColor] = useState("gray"); // For dynamic heart color

  const handleSymptomChange = (e) => {
    const value = e.target.value;
    setSymptoms((prevSymptoms) =>
      prevSymptoms.includes(value)
        ? prevSymptoms.filter((item) => item !== value)
        : [...prevSymptoms, value]
    );
  };

  const handleSubmit = async () => {
    const response = await fetch(
      "http://localhost:5000/api/novelty/analyze-symptoms",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      }
    );
    const data = await response.json();
    setResult(data.message); // Display disease prediction

    // Dynamic styling for result and heart color
    if (data.message.includes("Heart Attack")) {
      setResultClass("text-red-600");
      setHeartColor("red"); // Set heart color to red for heart attack
    } else if (data.message.includes("Gastritis")) {
      setResultClass("text-orange-600");
      setHeartColor("yellow"); // Set heart color to yellow for gastritis
    } else {
      setResultClass("text-green-600");
      setHeartColor("green"); // Set heart color to green for low risk
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-700">
          Select Your Symptoms
        </h2>

        <form>
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox value="Chest Pain" onChange={handleSymptomChange} />
              }
              label="Chest Pain"
            />
          </div>
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  value="Shortness of Breath"
                  onChange={handleSymptomChange}
                />
              }
              label="Shortness of Breath"
            />
          </div>
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox value="Fatigue" onChange={handleSymptomChange} />
              }
              label="Fatigue"
            />
          </div>
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox value="Nausea" onChange={handleSymptomChange} />
              }
              label="Nausea"
            />
          </div>
          <div className="mb-4">
            <FormControlLabel
              control={
                <Checkbox value="Dizziness" onChange={handleSymptomChange} />
              }
              label="Dizziness"
            />
          </div>
          <div className="mb-6">
            <FormControlLabel
              control={
                <Checkbox value="Heartburn" onChange={handleSymptomChange} />
              }
              label="Heartburn"
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            className="py-2"
          >
            Submit
          </Button>
        </form>

        {/* Display heart diagram with dynamic color */}
        {result && (
          <div className={`mt-6 text-center text-xl ${resultClass}`}>
            <p>{result}</p>
            {/* Dynamic SVG Heart based on prediction */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="100"
              height="100"
              className="mx-auto mt-4"
            >
              <path
                fill={heartColor}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoveltyComponent;
