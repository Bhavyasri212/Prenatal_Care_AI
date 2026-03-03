import os
import json
import logging
from typing import List, Dict, Any
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_wellness_fallback(risk_level: str) -> Dict[str, Any]:
    risk_level = risk_level.lower()
    
    if risk_level == 'high':
        return {
            "nutrition": {
                "breakfast": ["Oatmeal with berries", "Hard-boiled egg"],
                "lunch": ["Grilled chicken salad", "Quinoa with steamed vegetables"],
                "dinner": ["Baked salmon", "Asparagus and brown rice"],
                "snacks": ["Greek yogurt", "A handful of almonds"]
            },
            "physical_activity": ["Gentle stretching", "Short, slow walks (if approved by doctor)", "Pelvic floor exercises"],
            "wellness_tips": ["Prioritize 9 hours of sleep", "Stay hydrated (2-3L water)", "Practice deep breathing for 10 mins"],
            "summary": "Focus on high-nutrient, low-sodium meals and prioritize rest."
        }
    elif risk_level == 'mid':
        return {
            "nutrition": {
                "breakfast": ["Whole-grain toast with avocado", "Fresh fruit smoothie"],
                "lunch": ["Turkey wrap with spinach", "Lentil soup"],
                "dinner": ["Lean beef stir-fry", "Sweet potato and broccoli"],
                "snacks": ["Apple slices with peanut butter", "Cottage cheese"]
            },
            "physical_activity": ["Prenatal yoga", "30-minute brisk walk", "Low-impact swimming"],
            "wellness_tips": ["Maintain consistent sleep schedule", "Track daily water intake", "Limit caffeine intake"],
            "summary": "A balanced approach to nutrition and moderate activity to stabilize your vitals."
        }
    else:
        return {
            "nutrition": {
                "breakfast": ["Smoothie bowl with seeds", "Whole-grain pancakes"],
                "lunch": ["Quinoa power bowl", "Hummus and veggie pita"],
                "dinner": ["Roast chicken with root vegetables", "Zucchini noodles"],
                "snacks": ["Trail mix", "Pear with cheese"]
            },
            "physical_activity": ["Prenatal cardio", "Strength training (light weights)", "Moderate hiking"],
            "wellness_tips": ["Continue your active routine", "Stay consistent with hydration", "Focus on nutrient density"],
            "summary": "Your health is excellent! Maintain this momentum with varied whole foods and consistent activity."
        }

async def generate_wellness_plan(vitals: Dict[str, float], risk_level: str) -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key or api_key == "YOUR_GEMINI_API_KEY" or api_key.strip() == "":
        logger.warning("Gemini API key missing for Wellness. Using fallback.")
        return generate_wellness_fallback(risk_level)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash') # User used 2.5 but 1.5 or 2.0 is more common/available usually, but I'll stick to 1.5-flash for speed as I used before, or 2.0-flash if they prefer. Let's use 1.5-flash/2.0-flash as reliable. Actually user edited to 2.5-flash in reasoning.py? Wait, did they? 
        # Actually user edited reasoning.py to gemini-2.5-flash. I should probably use that if it exists for them.
        
        prompt = f"""
        Create a personalized Prenatal Nutrition and Wellness Plan for a patient.
        Speak directly to the patient in a supportive, guiding tone.
        
        CRITICAL:
        - DO NOT use long paragraphs.
        - Use short, actionable bullet points for all sections.
        - Keep the summary to one concise sentence.
        
        Patient Context:
        - Latest Vitals: {vitals}
        - Current Risk Profile: {risk_level}
        
        Tailor the advice specifically to the risk profile (e.g., if blood sugar is high, focus on low-glycemic foods; if BP is high, focus on low-sodium and stress reduction).
        
        Return a JSON object exactly with this structure:
        {{
            "nutrition": {{
                "breakfast": ["Short option 1", "Short option 2"],
                "lunch": ["Short option 1", "Short option 2"],
                "dinner": ["Short option 1", "Short option 2"],
                "snacks": ["Short option 1", "Short option 2"]
            }},
            "physical_activity": ["Actionable exercise 1", "Actionable exercise 2"],
            "wellness_tips": ["Concise tip 1", "Concise tip 2"],
            "summary": "One-sentence overview of the strategy."
        }}
        """
        
        response = model.generate_content(prompt)
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        return json.loads(text)
        
    except Exception as e:
        logger.error(f"Error generating wellness plan: {str(e)}")
        return generate_wellness_fallback(risk_level)
