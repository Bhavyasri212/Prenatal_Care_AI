#  Prenatal Care AI: The Future of Maternal Health

![Maternal Health Banner](https://img.shields.io/badge/Status-Premium%20Release-blueviolet?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Gemini-blue?style=for-the-badge)

**Prenatal Care AI** is a cutting-edge clinical decision support system designed to revolutionize maternal healthcare. By leveraging a custom **Multimodal Deep Learning Architecture**, the platform provides predictive insights that bridge the gap between traditional clinical observations and advanced diagnostic imaging.

---

## 🏥 The Mission
Maternal health monitoring often suffers from fragmented data. Our platform unifies clinical vitals with ultrasound analytics to provide a holistic "360-degree" view of patient health, ensuring that no critical indicator goes unnoticed.

---

## 🚀 Core Capabilities

### 🧠 Multimodal Risk Intelligence
Our custom model doesn't just look at numbers; it "sees" the clinical picture.
- **Data Fusion**: Simultaneously analyzes age, BP, glucose, and heart rate alongside ultrasound textures.
- **Predictive Accuracy**: Categorizes risk with high-confidence scoring, enabling proactive clinical intervention.

### 👶 Intelligent Fetal Analytics
- **Biometric Estimation**: Automated estimation of fetal weight based on real-time data fusion.
- **Growth Tracking**: (Beta) Pattern recognition to identify growth restrictions early.

### 💬 Patient-Centric AI Reasoning
Integrated with **Google Gemini Pro**, the platform transforms complex clinical findings into empowering, empathetic narratives for expectant mothers, ensuring they understand their journey without the medical jargon.

### 🍱 Tailored Wellness Ecosystem
Dynamic generation of wellness plans including:
- **Precision Nutrition**: Optimized for the user's current metabolic profile.
- **Guided Activity**: Personalized routines based on gestation and risk level.

---

## �️ System Architecture

![ARCHHHHHHH](https://github.com/user-attachments/assets/0ab520c2-be27-4202-85b0-8ae54334b120)


---

## 🛠️ Technical Implementation

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind | Cinematic, UX-first interface |
| **Animation** | Framer Motion | Smooth, organic interactions |
| **API Layer** | FastAPI (ASGI) | Ultra-fast data processing |
| **AI/ML** | TensorFlow/Keras, OpenCV | Multimodal data fusion & image analysis |
| **Reasoning** | Google Gemini | Generative insights & explanations |
| **Storage** | MongoDB | Resilient, schema-less history |

---

## ⚙️ Engineering Setup

### 1. Backend Core
```bash
cd backend
# Setup environment
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate
pip install -r requirements.txt
# Launch API
uvicorn main:app --reload
```

### 2. Frontend Interface
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Configuration
Ensure a `.env` file exists in the `/backend` directory:
```env
GEMINI_API_KEY=your_key_here
MONGO_URI=your_db_uri
```

---

## �️ Clinical Integrity & Disclaimer
This platform is a **Decision Support Tool**. It is designed to assist clinical workflows and provide patient education. It is **not** a diagnostic replacement. All results should be validated by a licensed medical professional.

---

## 💻 Contribution & Development
Developed with ❤️ by **Bhavyasri**.
*Building technology that cares.*
