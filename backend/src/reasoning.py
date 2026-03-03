import os
import json
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_findings_fallback(vitals: Dict[str, float]) -> List[Dict[str, Any]]:
    findings = []
    sbp = vitals.get("systolic_bp", 0)
    dbp = vitals.get("diastolic_bp", 0)
    bs = vitals.get("blood_sugar", 0)
    hr = vitals.get("heart_rate", 0)

    if sbp >= 140:
        findings.append({"category": "critical", "title": "High Blood Pressure", "detail": "Immediate medical evaluation required.", "metric": "systolic_bp", "value": sbp})
    elif sbp > 120:
        findings.append({"category": "warning", "title": "Elevated Blood Pressure", "detail": "Monitor closely for changes.", "metric": "systolic_bp", "value": sbp})
    
    if bs >= 10:
        findings.append({"category": "critical", "title": "High Blood Sugar", "detail": "Suggets high risk for gestational diabetes.", "metric": "blood_sugar", "value": bs})
    elif bs > 7.5:
        findings.append({"category": "warning", "title": "Borderline Blood Sugar", "detail": "Review nutritional intake.", "metric": "blood_sugar", "value": bs})

    return findings

def generate_clinical_reasoning_fallback(vitals: Dict[str, float], risk_level: str) -> Dict[str, Any]:
    risk_level = risk_level.lower()
    findings = generate_findings_fallback(vitals)
    
    if risk_level == 'high':
        advice = {
            "condition_summary": "Your body is showing significant stress markers that require immediate attention.",
            "immediate_actions": ["Contact clinical team immediately", "Period of total rest", "Monitor for severe symptoms"],
            "long_term_goals": ["Specialized care plan", "Daily monitoring", "Strict adherence to protocols"]
        }
        recs = ["Immediate clinical attention required", "Consult with specialist"]
    elif risk_level == 'mid':
        advice = {
            "condition_summary": "Your vitals are in a yellow light zone, requiring increased vigilance.",
            "immediate_actions": ["Follow-up within 48 hours", "Low-sodium meals", "Detailed vitals log"],
            "long_term_goals": ["Stabilize BP", "Balance glucose levels", "Consistent tracking"]
        }
        recs = ["Enhanced monitoring recommended", "Schedule follow-up"]
    else:
        advice = {
            "condition_summary": "Wonderful news! Your assessment shows that you and your baby are thriving.",
            "immediate_actions": ["Continue healthy routine", "Take prenatal vitamins", "Stay hydrated"],
            "long_term_goals": ["Maintain trajectory", "Consistent care", "Prepare for healthy delivery"]
        }
        recs = ["Continue routine care", "Maintain healthy lifestyle"]

    return {
        "findings": findings,
        "recommendations": recs,
        "what_if_suggestions": ["Nudge values towards normal to see risk shift"],
        "patient_advice": advice
    }

async def generate_clinical_reasoning(vitals: Dict[str, float], risk_level: str) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Debug logging
    if api_key:
        logger.info(f"GEMINI_API_KEY detected: {api_key[:4]}...{api_key[-4:]}")
    else:
        logger.warning("GEMINI_API_KEY is None in os.getenv")
        # Check all keys in os.environ for debugging
        logger.info(f"Available env keys: {list(os.environ.keys())}")
    
    if not api_key or api_key == "YOUR_GEMINI_API_KEY" or api_key.strip() == "":
        logger.warning("Gemini API key missing, empty, or placeholder. Using rule-based fallback.")
        return generate_clinical_reasoning_fallback(vitals, risk_level)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        Analyze the following prenatal health assessment results and provide clinical reasoning for the patient.
        Speak directly to the patient in a supportive, empathetic, and professional tone.
        
        CRITICAL:
        - DO NOT return long paragraphs.
        - Use short, concise bullet points for all sections.
        - Keep the condition summary to 2-3 brief, clear sentences.
        
        Vitals:
        - Age: {vitals.get('age')}
        - Systolic BP: {vitals.get('systolic_bp')} mmHg
        - Diastolic BP: {vitals.get('diastolic_bp')} mmHg
        - Blood Sugar: {vitals.get('blood_sugar')} mmol/L
        - Heart Rate: {vitals.get('heart_rate')} bpm
        
        Predicted Risk Level: {risk_level}
        
        Return a JSON object exactly with this structure:
        {{
            "findings": [
                {{
                    "category": "critical" | "warning" | "normal",
                    "title": "Short title",
                    "detail": "Concise explanation (max 15 words)",
                    "metric": "systolic_bp" | "diastolic_bp" | "blood_sugar" | "heart_rate",
                    "value": numerical value
                }}
            ],
            "recommendations": ["Concise recommendation (max 10 words)", "..."],
            "what_if_suggestions": ["Actionable improvement tip", "..."],
            "patient_advice": {{
                "condition_summary": "2-3 short, clear sentences summarizing health state.",
                "immediate_actions": ["Urgent step 1", "..."],
                "long_term_goals": ["Goal 1", "..."]
            }}
        }}
        """
        
        response = model.generate_content(prompt)
        # Attempt to parse JSON from response
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        reasoning_data = json.loads(text)
        return reasoning_data
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}. Falling back.")
        return generate_clinical_reasoning_fallback(vitals, risk_level)
