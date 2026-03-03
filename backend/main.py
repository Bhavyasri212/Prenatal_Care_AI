from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
import numpy as np
import pandas as pd
import cv2
import datetime
from bson import ObjectId
import os
from dotenv import load_dotenv

# Initialize environment variables from absolute path
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
print(f"DEBUG: Loading .env from {env_path}")
if not os.path.exists(env_path):
    print("DEBUG: .env not found at absolute path, trying current working directory")
    env_path = os.path.join(os.getcwd(), '.env')
loaded = load_dotenv(dotenv_path=env_path)
print(f"DEBUG: .env loaded: {loaded}")
print(f"DEBUG: GEMINI_API_KEY in environ: {'GEMINI_API_KEY' in os.environ}")

# Import your existing ML logic
from src.model import build_multimodal_model
from src.preprocessing import DataPreprocessor
from src.reasoning import generate_clinical_reasoning
from src.wellness import generate_wellness_plan

# Import Database operations
from src import schemas, crud
from src.database import patient_collection, assessment_collection
from src.auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

# Global variables to hold model and scaler
app_state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # LOAD SYSTEM ON STARTUP (Runs once)
    print("Loading AI Model and Scalers...")
    prep = DataPreprocessor()
    df_raw = prep.loader.load_maternal_risk_data()
    X_fused, y_fused = prep.fuse_datasets()
    X_clin, X_ctg, X_act, X_img = X_fused
    
    # Initialize and load weights
    model = build_multimodal_model(
        (X_clin.shape[1],), (X_ctg.shape[1], X_ctg.shape[2]), 
        (X_act.shape[1], X_act.shape[2]), (128, 128, 1)
    )
    model.load_weights("output/best_maternal_model__v4.keras")
    
    # --- ALIGN WITH STREAMLIT PREPROCESSING ---
    all_possible = [
        'Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate',
        'sleep_hours', 'phys_activity_level', 'stress_score',
        'education', 'income_category', 'urban_rural',
        'diet_quality', 'hemoglobin', 'iron_suppl', 'folic_suppl', 'diet_adherence'
    ]
    active_features = [c for c in all_possible if c in df_raw.columns]

    # Precompute means for filling missing inputs dynamically exactly like Streamlit
    df_numeric = df_raw[active_features].copy()
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    
    for col in df_numeric.columns:
        if df_numeric[col].dtype == 'object':
            le = LabelEncoder()
            df_numeric[col] = le.fit_transform(df_numeric[col].astype(str))

    df_numeric = df_numeric.apply(pd.to_numeric, errors="coerce")
    feature_means = df_numeric.mean(numeric_only=True)
    df_numeric = df_numeric.fillna(feature_means)

    scaler = StandardScaler()
    scaler.fit(df_numeric)
    
    # Get the specific rows Streamlit uses for fallback sensor data
    templates = {
        'Low': {
            'ctg': X_ctg[37].reshape(1, 11, 1),
            'act': X_act[37].reshape(1, 50, 3),
            'img': X_img[37].reshape(1, 128, 128, 1)
        },
        'Mid': {
            'ctg': X_ctg[13].reshape(1, 11, 1),
            'act': X_act[13].reshape(1, 50, 3),
            'img': X_img[13].reshape(1, 128, 128, 1)
        },
        'High': {
            'ctg': X_ctg[11].reshape(1, 11, 1),
            'act': X_act[11].reshape(1, 50, 3),
            'img': X_img[11].reshape(1, 128, 128, 1)
        }
    }
    
    app_state["model"] = model
    app_state["scaler"] = scaler
    app_state["active_features"] = active_features
    app_state["feature_means"] = feature_means
    app_state["templates"] = templates
    print("✅ System Ready")
    
    print("✅ System Ready")
    yield
    app_state.clear()

app = FastAPI(lifespan=lifespan, title="Maternal Health ML API")

# Allow React to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTHENTICATION ENDPOINTS ---

@app.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate):
    try:
        db_user = await crud.get_user_by_email(user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return await crud.create_user(user)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    from src.auth import verify_password
    user = await crud.get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user

# --- PATIENT DATABASE API ENDPOINTS ---

@app.get("/history", response_model=list[schemas.AssessmentResponse])
async def get_patient_history(current_user: dict = Depends(get_current_user)):
    return await crud.get_patient_assessments(str(current_user["_id"]))

@app.get("/wellness-plan", response_model=schemas.WellnessPlan)
async def get_wellness_plan(current_user: dict = Depends(get_current_user)):
    # Fetch the latest assessment that contains a wellness_plan
    latest_assessment = await assessment_collection.find_one(
        {
            "patient_id": str(current_user["_id"]),
            "wellness_plan": {"$ne": None}
        },
        sort=[("timestamp", -1)]
    )
    
    if latest_assessment and "wellness_plan" in latest_assessment:
        return latest_assessment["wellness_plan"]
    
    # Fallback: if no cached plan, generate one for the latest assessment (even if it didn't have one before)
    fallback_assessment = await assessment_collection.find_one(
        {"patient_id": str(current_user["_id"])},
        sort=[("timestamp", -1)]
    )
    
    vitals = fallback_assessment["vitals"] if fallback_assessment else {}
    risk_level = fallback_assessment["prediction"]["risk_level"] if fallback_assessment else "Low"
    
    plan = await generate_wellness_plan(vitals, risk_level)
    return plan

# --- MACHINE LEARNING PREDICTION ENDPOINT ---

@app.post("/predict")
async def predict_risk(
    age: float = Form(...),
    systolic_bp: float = Form(...),
    diastolic_bp: float = Form(...),
    blood_sugar: float = Form(...),
    heart_rate: float = Form(...),
    scenario: str = Form("Low"),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    patient_id = str(current_user["_id"])
    try:
        templates = app_state["templates"]
        
        # Decide which template to use (fallback to Low Risk template if unknown)
        scenario_key = scenario if scenario in templates else "Low"
        template = templates[scenario_key]

        # 1. Process Image
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        
        # Check if the image is the "dummy" image sent when no ultrasound is uploaded
        # Dummy images are very small or have the specific filename
        is_dummy = image.filename == "no_ultrasound.jpg" or (img is not None and img.shape[0] < 20)
        
        if img is None or is_dummy:
            # Fallback to the template image if no ultrasound provided for RISK assessment
            input_img = template["img"]
            fetal_weight_available = False
        else:
            img_resized = cv2.resize(img, (128, 128)) / 255.0
            input_img = img_resized.reshape(1, 128, 128, 1)
            fetal_weight_available = True

        # 2. Process Clinical Data (Streamlit Alignment)
        active_features = app_state["active_features"]
        feature_means = app_state["feature_means"]
        scaler = app_state["scaler"]

        # Map API inputs to feature names
        input_data = {
            'Age': age,
            'SystolicBP': systolic_bp,
            'DiastolicBP': diastolic_bp,
            'BS': blood_sugar,
            'HeartRate': heart_rate
        }

        # Build exactly 1 row with all required columns, filling missing with means
        row = []
        for feat in active_features:
            if feat in input_data:
                row.append(float(input_data[feat]))
            elif feat in feature_means:
                row.append(float(feature_means[feat]))
            else:
                row.append(0.0) # Absolute fallback

        # Scale using the global lifespan scaler
        input_clin_raw = np.array([row])
        input_clin_scaled = scaler.transform(input_clin_raw)

        # 3. Predict via Model using the mapped template's sensors
        model = app_state["model"]
        preds = model.predict([
            input_clin_scaled, 
            template["ctg"], 
            template["act"], 
            input_img
        ])
        
        risk_probs = preds[0][0].tolist() # [Low, Mid, High]
        weight_pred = float(preds[1][0][0]) if fetal_weight_available else None
        
        idx_max = np.argmax(risk_probs)
        risk_levels = ['LOW', 'MID', 'HIGH']
        final_risk = risk_levels[idx_max]

        # ✨ NEW: BUILD AND SAVE ASSESSMENT
        new_assessment = {
            "patient_id": patient_id,
            "timestamp": datetime.datetime.utcnow(),
            "vitals": {
                "age": age,
                "systolic_bp": systolic_bp,
                "diastolic_bp": diastolic_bp,
                "blood_sugar": blood_sugar,
                "heart_rate": heart_rate
            },
            "prediction": {
                "risk_level": final_risk,
                "confidence": float(np.max(risk_probs))
            },
            "fetal_weight": weight_pred
        }
        
        # 4. Generate AI Reasoning (via Gemini or Fallback)
        reasoning = await generate_clinical_reasoning(new_assessment["vitals"], final_risk)
        new_assessment.update(reasoning)
        
        # 5. Generate & Cache Wellness Plan (only on new assessment)
        wellness_plan = await generate_wellness_plan(new_assessment["vitals"], final_risk)
        new_assessment["wellness_plan"] = wellness_plan
        
        assessment_id = await crud.create_patient_assessment(new_assessment)

        return {
            "status": "success",
            "assessment_id": assessment_id,
            "risk_probabilities": {
                "Low": risk_probs[0],
                "Mid": risk_probs[1],
                "High": risk_probs[2]
            },
            "final_risk": final_risk,
            "fetal_weight_available": fetal_weight_available,
            "estimated_weight_g": weight_pred,
            "reasoning": reasoning,
            "wellness_plan": wellness_plan
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))