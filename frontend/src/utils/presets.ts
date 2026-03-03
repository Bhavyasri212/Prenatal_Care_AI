import { PresetProfile, VitalSigns } from '../types';

export const presetProfiles: Record<string, PresetProfile> = {
  low: {
    label: 'Low Risk',
    vitals: {
      age: 28,
      systolicBP: 115,
      diastolicBP: 72,
      bloodSugar: 7.2,
      bodyTemp: 98.6,
      heartRate: 75,
    },
    scenario: 'healthy',
  },
  mid: {
    label: 'Mid Risk',
    vitals: {
      age: 35,
      systolicBP: 130,
      diastolicBP: 85,
      bloodSugar: 9.5,
      bodyTemp: 99.2,
      heartRate: 88,
    },
    scenario: 'healthy',
  },
  high: {
    label: 'High Risk',
    vitals: {
      age: 40,
      systolicBP: 148,
      diastolicBP: 95,
      bloodSugar: 12.8,
      bodyTemp: 100.4,
      heartRate: 105,
    },
    scenario: 'distress',
  },
};

export const defaultVitals: VitalSigns = {
  age: 30,
  systolicBP: 120,
  diastolicBP: 80,
  bloodSugar: 8.0,
  bodyTemp: 98.6,
  heartRate: 80,
};
