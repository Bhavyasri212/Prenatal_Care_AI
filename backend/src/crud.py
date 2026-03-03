from bson import ObjectId
import datetime
from . import schemas
from .database import patient_collection, assessment_collection

def assessment_helper(assessment) -> dict:
    return {
        "_id": str(assessment["_id"]),
        "patient_id": assessment["patient_id"],
        "timestamp": assessment["timestamp"],
        "vitals": assessment["vitals"],
        "prediction": assessment["prediction"],
        "fetal_weight": assessment["fetal_weight"]
    }

async def get_patient(patient_id: str):
    patient = await patient_collection.find_one({"_id": ObjectId(patient_id)})
    if patient:
        patient["_id"] = str(patient["_id"])
    return patient

async def create_patient(patient: schemas.PatientCreate):
    patient_dict = patient.dict()
    patient_dict["created_at"] = datetime.datetime.utcnow()
    
    result = await patient_collection.insert_one(patient_dict)
    patient_dict["_id"] = str(result.inserted_id)
    return patient_dict

async def get_patient_assessments(patient_id: str, skip: int = 0, limit: int = 100):
    assessments = []
    cursor = assessment_collection.find({"patient_id": patient_id}).sort("timestamp", -1).skip(skip).limit(limit)
    async for assessment in cursor:
        assessments.append(assessment_helper(assessment))
    return assessments

async def create_patient_assessment(assessment: dict):
    # Assessment is passed as a ready-to-insert dict from main.py
    result = await assessment_collection.insert_one(assessment)
    return str(result.inserted_id)

async def get_user_by_email(email: str):
    return await patient_collection.find_one({"email": email})

async def create_user(user: schemas.UserCreate):
    from .auth import get_password_hash
    user_dict = user.model_dump()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.datetime.utcnow()
    
    result = await patient_collection.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict
