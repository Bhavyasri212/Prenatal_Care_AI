export interface VitalSigns {
    age: number;
    systolicBP: number;
    diastolicBP: number;
    bloodSugar: number;
    bodyTemp: number;
    heartRate: number;
  }
  
  export interface RiskPrediction {
    riskLevel: 'low' | 'mid' | 'high';
    confidence: number;
    probabilities: {
      low: number;
      mid: number;
      high: number;
    };
    fetalWeight: number | null;
  }
  
  export interface ClinicalFinding {
    category: 'normal' | 'warning' | 'critical';
    title: string;
    detail: string;
    metric: string;
    value: number;
  }
  
  export interface PresetProfile {
    label: string;
    vitals: VitalSigns;
    scenario: 'healthy' | 'distress';
  }
  
  export interface ShapFeature {
    feature: string;
    contribution: number;
    value: number;
  }
  
  export interface LimeFeature {
    feature: string;
    contribution: number;
    direction: 'increases' | 'decreases';
  }
  
  export interface PatientAdvice {
    conditionSummary: string;
    immediateActions: string[];
    longTermGoals: string[];
  }
  
  export interface AnalysisResult {
    prediction: RiskPrediction;
    findings: ClinicalFinding[];
    recommendations: string[];
    whatIfSuggestions: string[];
    patientAdvice: PatientAdvice;
    shapFeatures: ShapFeature[];
    limeFeatures: LimeFeature[];
    modelConfidence: {
      clinicalData: number;
      sensors: number;
      ultrasound: number;
    };
  }
  