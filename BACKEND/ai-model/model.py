import sys
import json

# Load symptoms from command-line argument
symptoms = json.loads(sys.argv[1])
symptoms = [s.lower() for s in symptoms]  # normalize

# Debug: Log received input
print("DEBUG received symptoms:", symptoms, file=sys.stderr)

def match_all(required):
    return all(s.lower() in symptoms for s in required)

def match_any(required):
    return any(s.lower() in symptoms for s in required)

def predict(symptoms):
    # Heart Attack
    if match_all(["chest pain", "shortness of breath", "sweating"]) or \
       match_any(["dizziness", "jaw pain", "left arm pain"]):
        return "High Risk: Heart Attack"

    # Gastritis
    if match_all(["stomach pain", "bloating", "heartburn"]) or \
       match_all(["stomach pain", "vomiting", "loss of appetite"]):
        return "Likely: Gastritis"

    # GERD (Acid Reflux)
    if match_all(["heartburn", "regurgitation", "difficulty swallowing"]):
        return "Likely: Acid Reflux (GERD)"

    # Anxiety or Panic Attack
    if match_all(["chest pain", "shortness of breath", "racing heart"]) or \
       match_any(["dizziness", "nausea", "sweating"]):
        return "Possibly: Anxiety or Panic Attack"

    # Peptic Ulcer
    if match_all(["stomach pain", "bloating", "nausea"]):
        return "Possible: Peptic Ulcer"

    # Pulmonary Embolism
    if match_all(["sudden shortness of breath", "chest pain", "coughing blood"]):
        return "Critical: Pulmonary Embolism (Call Emergency)"

    return "Not Conclusive: Seek Clinical Advice"

# Output prediction (ensure subprocess captures it)
print(predict(symptoms), flush=True)

