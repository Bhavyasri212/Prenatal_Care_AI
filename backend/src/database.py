import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

# Get MongoDB URI from environment or default to local
MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)

# Database Name
database = client.maternal_health_db

# Collections
patient_collection = database.get_collection("patients")
assessment_collection = database.get_collection("assessments")

def get_db():
    return database
