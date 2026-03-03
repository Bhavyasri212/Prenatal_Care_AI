import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI default port

export const analyzePatient = async (vitals, imageFile) => {
    const formData = new FormData();
    formData.append('age', vitals.age);
    formData.append('systolic_bp', vitals.systolicBp);
    formData.append('diastolic_bp', vitals.diastolicBp);
    formData.append('blood_sugar', vitals.bloodSugar);
    formData.append('heart_rate', vitals.heartRate);
    formData.append('image', imageFile);

    const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};