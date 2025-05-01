# main.py (FastAPI backend for AI Health Chatbot)
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import pymongo
import re

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection (update URI as needed)
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.healthcare
vitals_collection = db.vitals


class ChatRequest(BaseModel):
    message: str


@app.post("/api/chat/analyze")
async def analyze_chat(request: ChatRequest):
    message = request.message.lower()

    # Very basic NLP to extract known symptoms from message
    known_symptoms = [
        "chest pain",
        "shortness of breath",
        "sweating",
        "dizziness",
        "jaw pain",
        "left arm pain",
        "nausea",
        "vomiting",
        "stomach pain",
        "bloating",
        "heartburn",
        "loss of appetite",
        "regurgitation",
        "difficulty swallowing",
        "racing heart",
        "coughing",
        "coughing blood",
    ]
    symptoms = [sym for sym in known_symptoms if sym in message]

    if not symptoms:
        return {"response": "Please describe your symptoms in more detail."}

    # Fetch latest vitals
    vitals = vitals_collection.find_one(sort=[("_id", -1)]) or {}
    bp = vitals.get("bp", 120)
    pulse = vitals.get("pulse", 75)
    sugar = vitals.get("sugar", 100)

    # Call Python analysis script
    try:
        process = subprocess.Popen(
            ["python", "model.py", json.dumps(symptoms)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output, error = process.communicate()
        prediction = output.decode().strip()
        print("Prediction:", prediction)  # ✅ DEBUG LOG
    except Exception as e:
        print("Subprocess error:", e)
        return {"response": "Error running prediction engine."}

    # Modify severity based on vitals (cross-check)
    if "low" in prediction.lower():
        if bp > 140 or pulse > 100:
            prediction += (
                "\nNote: Your vitals indicate elevated risk. Consider medical advice."
            )

    return {
        "response": f"Based on symptoms ({', '.join(symptoms)}), the system suggests: {prediction}"
    }


# Run this via: uvicorn main:app --reload --port 8000

