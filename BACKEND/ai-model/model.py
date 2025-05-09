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

def calculate_condition_probability(condition_symptoms):
    """Calculate probability percentage for a condition based on matched symptoms"""
    matched_count = sum(1 for s in condition_symptoms if s.lower() in symptoms)
    total_count = len(condition_symptoms)
    return (matched_count / total_count) * 100 if total_count > 0 else 0

def get_severity(probability):
    """Convert probability to severity level"""
    if probability >= 70:
        return "high"
    elif probability >= 40:
        return "medium"
    else:
        return "low"

def predict(symptoms):
    # Define symptom sets for conditions
    heart_attack_symptoms = [
        "chest pain", "shortness of breath", "racing heart", 
        "left arm pain", "jaw pain", "sweating", "dizziness"
    ]
    
    gastritis_symptoms = [
        "nausea", "vomiting", "stomach pain", "bloating", 
        "heartburn", "loss of appetite", "regurgitation"
    ]
    
    # Calculate probabilities
    heart_attack_prob = calculate_condition_probability(heart_attack_symptoms)
    gastritis_prob = calculate_condition_probability(gastritis_symptoms)
    
    # Get severity levels
    heart_attack_severity = get_severity(heart_attack_prob)
    gastritis_severity = get_severity(gastritis_prob)
    
    # Determine most likely condition
    if heart_attack_prob >= 30 and heart_attack_prob >= gastritis_prob:
        if heart_attack_severity == "high":
            return "Critical Risk: Heart Attack - Seek immediate medical attention!"
        elif heart_attack_severity == "medium":
            return "Moderate Risk: Possible Heart Issues - Consider urgent medical advice"
        else:
            return "Low Risk: Some heart-related symptoms - Monitor and consult doctor if they persist"
    
    elif gastritis_prob >= 30:
        if gastritis_severity == "high":
            return "High Likelihood: Gastritis - Consult with a healthcare provider"
        elif gastritis_severity == "medium":
            return "Moderate Likelihood: Possible Gastritis - Consider dietary changes and medical consultation"
        else:
            return "Low Likelihood: Mild digestive issues - Monitor symptoms and avoid trigger foods"
    
    # Special cases based on specific symptom combinations
    if match_all(["chest pain", "shortness of breath", "sweating"]):
        return "High Risk: Heart Attack - Seek immediate medical attention!"
    
    if match_all(["stomach pain", "bloating", "heartburn"]):
        return "Likely: Gastritis - Consult with a healthcare provider"
    
    # GERD (Acid Reflux)
    if match_all(["heartburn", "regurgitation", "difficulty swallowing"]):
        return "Likely: Acid Reflux (GERD) - Consider dietary changes and antacids"
    
    # Anxiety or Panic Attack
    if match_all(["chest pain", "shortness of breath", "racing heart"]):
        return "Possibly: Anxiety or Panic Attack - Try relaxation techniques and consider medical advice"
    
    # Pulmonary Embolism
    if match_all(["sudden shortness of breath", "chest pain", "coughing blood"]):
        return "Critical: Pulmonary Embolism - CALL EMERGENCY SERVICES IMMEDIATELY!"
    
    return "Not Conclusive: Insufficient symptoms to determine condition - Consider medical consultation"

# Output prediction (ensure subprocess captures it)
print(predict(symptoms), flush=True)

