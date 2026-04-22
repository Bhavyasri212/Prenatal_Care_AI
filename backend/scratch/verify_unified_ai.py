import asyncio
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.clinical_engine import generate_unified_insights
from dotenv import load_dotenv

async def test_unified_engine():
    load_dotenv(dotenv_path='backend/.env')
    print("Testing Unified Clinical Engine...")
    
    vitals = {
        "age": 28,
        "systolic_bp": 135,
        "diastolic_bp": 85,
        "blood_sugar": 8.2,
        "heart_rate": 78
    }
    risk_level = "MID"
    
    print(f"Sending vitals: {vitals}")
    print(f"Risk: {risk_level}")
    
    results = await generate_unified_insights(vitals, risk_level)
    
    print("\n--- RESULTS ---")
    if "reasoning" in results:
        print("[OK] Reasoning found")
        print(f"Summary: {results['reasoning'].get('patient_advice', {}).get('condition_summary')}")
    else:
        print("[FAIL] Reasoning missing")
        
    if "wellness" in results:
        print("[OK] Wellness found")
        print(f"Wellness Summary: {results['wellness'].get('summary')}")
    else:
        print("[FAIL] Wellness missing")

if __name__ == "__main__":
    asyncio.run(test_unified_engine())
