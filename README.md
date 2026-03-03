# 🤱 Prenatal Care AI

[![AI-Powered](https://img.shields.io/badge/AI-Powered-blueviolet)](https://github.com/Bhavyasri212/Prenatal_Care_AI)
[![Framework](https://img.shields.io/badge/Framework-FastAPI%20%2B%20React-blue)](https://github.com/Bhavyasri212/Prenatal_Care_AI)
[![HealthTech](https://img.shields.io/badge/Industry-HealthTech-green)](https://github.com/Bhavyasri212/Prenatal_Care_AI)

**Prenatal Care AI** is a premium, state-of-the-art maternal health platform designed to empower expectant mothers and healthcare providers with advanced AI analytics. By fusing clinical data with ultrasound imaging, the platform provides real-time risk assessments, fetal growth estimations, and personalized wellness plans.

---

## 🌟 Key Features

### 🔍 Multimodal Risk Assessment
Combines vital signs (BP, Blood Sugar, Heart Rate) with ultrasound image analysis using a custom deep learning model (TensorFlow/Keras) to categorize pregnancy risk levels (Low, Mid, High).

### 👶 AI Fetal Weight Estimation
Utilizes clinical parameters and ultrasound data to provide an estimated fetal weight (EFW), providing early insights into fetal development.

### 🧠 Gemini-Powered Clinical Reasoning
Integrates **Google Gemini AI** to provide human-readable, patient-centric explanations of assessment results, removing jargon and focusing on empowering the mother.

### 🍱 Personalized Wellness Plans
Generates dynamic nutrition, activity, and mental health recommendations tailored to the user's current risk profile and vital signs.

### 🎨 Cinematic & Premium UI
A modern, responsive dashboard featuring:
- **Glassmorphism** and parallax effects.
- **Mesh Gradients** and smooth Framer Motion animations.
- **Comprehensive Reports** and a minimalist Settings portal.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** (Custom Clinical Design System)
- **Lucide React** (Icons)
- **Framer Motion** (Animations)
- **Sonner** (Toasts)

### Backend
- **FastAPI** (Python High-Performance Framework)
- **TensorFlow** (Deep Learning Logic)
- **OpenCV** (Image Preprocessing)
- **Google Generative AI** (Gemini API for Reasoning)
- **MongoDB / Motor** (Asynchronous Database)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB instance (Local or Atlas)
- Google Gemini API Key

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   MONGO_URI=your_mongodb_uri
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── backend/
│   ├── main.py            # API Gateway & Lifespan
│   ├── src/               # AI & Database Logic
│   └── data/              # Model weights & Datasets
├── frontend/
│   ├── src/
│   │   ├── components/    # Modular UI Components
│   │   ├── context/       # Auth & Global State
│   │   └── utils/         # AI Integration Engine
│   └── tailwind.config.js # Design System Tokens
└── README.md
```

---

## 📜 License
This project is for educational and clinical demonstration purposes.

---

## 🤝 Developed By
**Bhavyasri** - [GitHub Profile](https://github.com/Bhavyasri212)

*Disclaimer: This tool is intended to supplement professional medical advice, not replace it. Always consult with a qualified healthcare provider for medical concerns.*
