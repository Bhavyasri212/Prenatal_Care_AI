import { VitalSigns, AnalysisResult, RiskPrediction, ClinicalFinding, ShapFeature, LimeFeature } from '../types';

export async function analyzePatient(
  vitals: VitalSigns,
  imageFile: File | null,
  scenario: string,
  token: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('age', vitals.age.toString());
  formData.append('systolic_bp', vitals.systolicBP.toString());
  formData.append('diastolic_bp', vitals.diastolicBP.toString());
  formData.append('blood_sugar', vitals.bloodSugar.toString());
  formData.append('heart_rate', vitals.heartRate.toString());
  formData.append('scenario', scenario);

  if (imageFile) {
    formData.append('image', imageFile);
  } else {
    // Provide a named dummy image so backend can detect missing ultrasound
    const dummyBlob = new Blob([new Uint8Array(10).buffer], { type: 'image/jpeg' });
    formData.append('image', new File([dummyBlob], 'no_ultrasound.jpg', { type: 'image/jpeg' }));
  }

  const response = await fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from backend model');
  }

  const data = await response.json();
  const probs = data.risk_probabilities;
  const riskLevel = data.final_risk ? data.final_risk.toLowerCase() : 'low';
  
  const prediction = {
    riskLevel: riskLevel as 'low' | 'mid' | 'high',
    confidence: Math.max(probs.Low || 0, probs.Mid || 0, probs.High || 0),
    probabilities: { low: probs.Low, mid: probs.Mid, high: probs.High },
    fetalWeight: data.estimated_weight_g, // Now clearly using backend's null/value
  };

  // Extract reasoning from backend
  const br = data.reasoning;
  
  const findings = br.findings.map((f: any) => ({
    category: f.category,
    title: f.title,
    detail: f.detail,
    metric: f.metric === 'systolic_bp' ? 'systolicBP' : f.metric === 'blood_sugar' ? 'bloodSugar' : f.metric === 'diastolic_bp' ? 'diastolicBP' : f.metric,
    value: f.value
  }));

  const recommendations = br.recommendations;
  const whatIfSuggestions = br.what_if_suggestions;
  const patientAdvice = {
    conditionSummary: br.patient_advice.condition_summary,
    immediateActions: br.patient_advice.immediate_actions,
    longTermGoals: br.patient_advice.long_term_goals
  };

  const shapFeatures = generateShapFeatures(vitals);
  const limeFeatures = generateLimeFeatures(vitals);
  const modelConfidence = calculateModelConfidence(!!imageFile);

  return {
    prediction,
    findings,
    recommendations,
    whatIfSuggestions,
    patientAdvice,
    shapFeatures,
    limeFeatures,
    modelConfidence,
  };
}

function calculateRiskScore(vitals: VitalSigns): number {
  let score = 0;

  if (vitals.systolicBP >= 140) score += 35;
  else if (vitals.systolicBP >= 130) score += 25;
  else if (vitals.systolicBP >= 120) score += 15;

  if (vitals.diastolicBP >= 90) score += 25;
  else if (vitals.diastolicBP >= 85) score += 15;
  else if (vitals.diastolicBP >= 80) score += 8;

  if (vitals.bloodSugar >= 11) score += 30;
  else if (vitals.bloodSugar >= 9) score += 20;
  else if (vitals.bloodSugar >= 7.5) score += 10;

  if (vitals.heartRate > 100) score += 15;
  else if (vitals.heartRate < 60) score += 10;

  if (vitals.bodyTemp >= 100.4) score += 15;
  else if (vitals.bodyTemp >= 99.5) score += 8;

  if (vitals.age >= 40) score += 15;
  else if (vitals.age >= 35) score += 8;

  return Math.min(score, 100);
}

function generatePrediction(riskScore: number, hasUltrasound: boolean): RiskPrediction {
  let riskLevel: 'low' | 'mid' | 'high';
  let probabilities: { low: number; mid: number; high: number };

  if (riskScore < 30) {
    riskLevel = 'low';
    probabilities = {
      low: 0.7 + Math.random() * 0.25,
      mid: 0.15 + Math.random() * 0.1,
      high: 0.05 + Math.random() * 0.05,
    };
  } else if (riskScore < 60) {
    riskLevel = 'mid';
    probabilities = {
      low: 0.2 + Math.random() * 0.15,
      mid: 0.5 + Math.random() * 0.3,
      high: 0.15 + Math.random() * 0.15,
    };
  } else {
    riskLevel = 'high';
    probabilities = {
      low: 0.05 + Math.random() * 0.05,
      mid: 0.2 + Math.random() * 0.15,
      high: 0.65 + Math.random() * 0.3,
    };
  }

  const total = probabilities.low + probabilities.mid + probabilities.high;
  probabilities.low /= total;
  probabilities.mid /= total;
  probabilities.high /= total;

  const confidence = probabilities[riskLevel];
  const fetalWeight = hasUltrasound ? 2400 + Math.random() * 1200 : 2800;

  return {
    riskLevel,
    confidence,
    probabilities,
    fetalWeight,
  };
}

// Local utilities for ML explainability (kept in frontend)

function generateShapFeatures(vitals: VitalSigns): ShapFeature[] {
  const features: ShapFeature[] = [
    {
      feature: 'SystolicBP',
      contribution: (vitals.systolicBP - 120) * 0.015,
      value: vitals.systolicBP,
    },
    {
      feature: 'BloodSugar',
      contribution: (vitals.bloodSugar - 7.5) * 0.04,
      value: vitals.bloodSugar,
    },
    {
      feature: 'Age',
      contribution: (vitals.age - 30) * 0.008,
      value: vitals.age,
    },
    {
      feature: 'DiastolicBP',
      contribution: (vitals.diastolicBP - 80) * 0.012,
      value: vitals.diastolicBP,
    },
    {
      feature: 'HeartRate',
      contribution: (vitals.heartRate - 75) * 0.005,
      value: vitals.heartRate,
    },
    {
      feature: 'BodyTemp',
      contribution: (vitals.bodyTemp - 98.6) * 0.02,
      value: vitals.bodyTemp,
    },
  ];

  return features.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}

function generateLimeFeatures(vitals: VitalSigns): LimeFeature[] {
  const features: LimeFeature[] = [];

  if (vitals.systolicBP > 120) {
    features.push({
        feature: 'SystolicBP > 120',
        contribution: (vitals.systolicBP - 120) * 0.015,
        direction: 'increases',
    });
  }

  if (vitals.bloodSugar > 7.5) {
    features.push({
        feature: 'BloodSugar > 7.5',
        contribution: (vitals.bloodSugar - 7.5) * 0.04,
        direction: 'increases',
    });
  }

  return features.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
}

// calculateModelConfidence remains for UI explanation

function calculateModelConfidence(hasUltrasound: boolean): { clinicalData: number; sensors: number; ultrasound: number } {
  const base = {
    clinicalData: 0.4,
    sensors: 0.35,
    ultrasound: hasUltrasound ? 0.25 : 0,
  };

  if (!hasUltrasound) {
    base.clinicalData = 0.55;
    base.sensors = 0.45;
  }

  return base;
}
