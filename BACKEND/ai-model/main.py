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


# Health condition knowledge base
condition_info = {
    "heart_attack": {
        "symptoms": [
            "chest pain", "shortness of breath", "sweating", 
            "dizziness", "jaw pain", "left arm pain", "nausea"
        ],
        "risk_factors": [
            "high blood pressure", "high cholesterol", "smoking",
            "diabetes", "obesity", "family history", "stress"
        ],
        "prevention": [
            "regular exercise", "healthy diet", "quit smoking",
            "limit alcohol", "manage stress", "regular check-ups"
        ],
        "emergency_signs": [
            "severe chest pain", "pain spreading to arms/jaw",
            "sudden shortness of breath", "cold sweat", "lightheadedness"
        ]
    },
    "gastritis": {
        "symptoms": [
            "stomach pain", "bloating", "heartburn", "nausea",
            "vomiting", "loss of appetite", "feeling full quickly"
        ],
        "risk_factors": [
            "h. pylori infection", "regular nsaid use", "excessive alcohol",
            "stress", "autoimmune disorders", "bile reflux"
        ],
        "prevention": [
            "avoid irritating foods", "limit alcohol", "eat smaller meals",
            "manage stress", "avoid nsaids", "treatment for h. pylori"
        ],
        "diet_recommendations": [
            "avoid spicy foods", "limit acidic foods", "avoid caffeine",
            "eat high-fiber foods", "stay hydrated", "eat regularly"
        ],
        "treatment": [
            "proton pump inhibitors", "acid reducers", "antacids",
            "antibiotics (for H. pylori)", "eliminate trigger foods",
            "stress reduction techniques", "smaller meals", "avoid alcohol"
        ]
    }
}

# Predefined responses for suggested messages
def get_suggested_response(message):
    """Provide predefined responses for common suggested queries"""
    message = message.lower().strip()
    
    # Map exact matches to concise responses (1-3 sentences)
    suggested_responses = {
        "i have chest pain": "Chest pain can be caused by heart issues (like angina or heart attack), lung problems, digestive issues, or muscle strain. Seek emergency medical attention for severe chest pain, especially with shortness of breath or pain radiating to arm/jaw. Does the pain come and go or is it constant?",
        
        "feeling dizzy": "Dizziness may be caused by inner ear problems, dehydration, blood pressure issues, or anxiety. For persistent dizziness or if accompanied by severe headache or vision changes, please seek medical attention. Are you experiencing any other symptoms with your dizziness?",
        
        "stomach hurts": "Stomach pain could be indigestion, gastritis, food poisoning, or something more serious like ulcers or appendicitis. The location and timing of your pain can help determine the cause. Can you describe where exactly the pain is located?",
        
        "shortness of breath": "Shortness of breath may result from respiratory issues, heart problems, anxiety, or overexertion. Sudden severe breathing difficulty, especially with chest pain, could be an emergency requiring immediate medical attention. Is this a new symptom for you?",
        
        "how to treat gastritis?": "Gastritis treatment includes medications like antacids or acid reducers, avoiding trigger foods (spicy, acidic), eating smaller meals, and avoiding alcohol and NSAIDs. For persistent symptoms, please consult with your healthcare provider for proper diagnosis and treatment plan."
    }
    
    return suggested_responses.get(message)


def get_condition_answer(message):
    """Extract health condition questions and provide answers based on knowledge base"""
    message = message.lower()
    
    # Check for general condition questions
    heart_attack_patterns = [
        r"heart attack", r"cardiac arrest", r"heart pain", r"heart condition"
    ]
    
    gastritis_patterns = [
        r"gastritis", r"stomach inflammation", r"stomach pain", r"acid reflux", r"indigestion"
    ]
    
    # Determine which condition is being asked about
    condition = None
    if any(re.search(pattern, message) for pattern in heart_attack_patterns):
        condition = "heart_attack"
    elif any(re.search(pattern, message) for pattern in gastritis_patterns):
        condition = "gastritis"
    
    if not condition:
        return None
    
    # Look for specific question types
    if re.search(r"symptom|sign|feel|experiencing", message):
        return f"Common symptoms of {condition.replace('_', ' ')} include: " + ", ".join(condition_info[condition]["symptoms"])
    
    elif re.search(r"cause|risk factor|reason", message):
        return f"Risk factors for {condition.replace('_', ' ')} include: " + ", ".join(condition_info[condition]["risk_factors"])
    
    elif re.search(r"prevent|avoid|stop", message):
        return f"Prevention measures for {condition.replace('_', ' ')} include: " + ", ".join(condition_info[condition]["prevention"])
    
    elif re.search(r"treat|cure|heal|therapy|medication", message) and condition == "gastritis":
        return f"Treatment options for gastritis include: " + ", ".join(condition_info[condition]["treatment"])
    
    elif condition == "heart_attack" and re.search(r"emergency|urgent|serious", message):
        return f"Emergency signs of a heart attack include: " + ", ".join(condition_info[condition]["emergency_signs"])
    
    elif condition == "gastritis" and re.search(r"diet|eat|food", message):
        return f"Dietary recommendations for gastritis: " + ", ".join(condition_info[condition]["diet_recommendations"])
    
    # General information about the condition
    elif condition == "heart_attack":
        return "A heart attack occurs when blood flow to part of the heart is blocked, causing damage to heart muscle. It's a medical emergency requiring immediate attention. Common symptoms include chest pain, shortness of breath, and pain radiating to the arm or jaw."
    
    elif condition == "gastritis":
        return "Gastritis is inflammation of the stomach lining, often caused by infection, excessive alcohol, or regular use of certain pain relievers. Symptoms include stomach pain, nausea, and reduced appetite. Most cases can be managed with lifestyle changes and medication."
    
    return None


@app.post("/api/chat/analyze")
async def analyze_chat(request: ChatRequest):
    message = request.message
    
    # First, check if this is one of the suggested responses
    suggested_response = get_suggested_response(message)
    if suggested_response:
        return {"response": suggested_response}
    
    # Then, check if this is a specific condition question
    condition_answer = get_condition_answer(message.lower())
    if condition_answer:
        return {"response": condition_answer}

    # Very basic NLP to extract known symptoms from message
    message_lower = message.lower()
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
    symptoms = [sym for sym in known_symptoms if sym in message_lower]

    if not symptoms:
        return {"response": "Please describe your symptoms in more detail, or ask a specific question about heart attack or gastritis."}

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


# New endpoint for structured symptom analysis
class SymptomAnalysisRequest(BaseModel):
    symptoms: list

@app.post("/api/novelty/analyze")
async def analyze_symptoms(request: SymptomAnalysisRequest):
    symptoms = [s.lower() for s in request.symptoms]
    
    # Call model.py with the symptoms for analysis
    try:
        process = subprocess.Popen(
            ["python", "model.py", json.dumps(symptoms)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output, error = process.communicate()
        prediction = output.decode().strip()
        print("Structured Analysis Prediction:", prediction)
    except Exception as e:
        print("Subprocess error:", e)
        return {"prediction": "Error analyzing symptoms"}
    
    return {"prediction": prediction}


# Run this via: uvicorn main:app --reload --port 8000