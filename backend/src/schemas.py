from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import datetime

class Vitals(BaseModel):
    age: float
    systolic_bp: float
    diastolic_bp: float
    blood_sugar: float
    heart_rate: Optional[float] = None
    body_temp: Optional[float] = None

class PatientAdvice(BaseModel):
    condition_summary: str
    immediate_actions: List[str]
    long_term_goals: List[str]

class ClinicalFinding(BaseModel):
    category: str
    title: str
    detail: str
    metric: str
    value: float

class Prediction(BaseModel):
    risk_level: str
    confidence: float

class WellnessPlan(BaseModel):
    nutrition: Dict[str, List[str]]
    physical_activity: List[str]
    wellness_tips: List[str]
    summary: str

class AssessmentBase(BaseModel):
    patient_id: str
    vitals: Vitals
    prediction: Prediction
    fetal_weight: float
    findings: Optional[List[ClinicalFinding]] = None
    recommendations: Optional[List[str]] = None
    what_if_suggestions: Optional[List[str]] = None
    patient_advice: Optional[PatientAdvice] = None
    wellness_plan: Optional[WellnessPlan] = None

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: str = Field(alias="_id")
    timestamp: datetime.datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime.datetime: lambda dt: dt.isoformat()}
    )

class PatientBase(BaseModel):
    name: str
    age: int

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: str = Field(alias="_id")
    created_at: datetime.datetime
    # We might not embed all assessments here for performance
    # but keeping it for now if needed.

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime.datetime: lambda dt: dt.isoformat()}
    )

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime.datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime.datetime: lambda dt: dt.isoformat()}
    )

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
