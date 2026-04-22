import google.generativeai as genai
import os
from dotenv import load_dotenv

# Use the workspace root for .env
load_dotenv(dotenv_path='c:/Users/sdgeryuj/Downloads/Prenatal_Care_AI/backend/.env')
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("API Key not found")
else:
    genai.configure(api_key=api_key)
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
