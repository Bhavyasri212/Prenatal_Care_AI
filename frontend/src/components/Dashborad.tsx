import React, { useState } from 'react';
import { Header } from './Header';
import { SectionCard } from './Card';
import { Button } from './Button';
import { Slider } from './Slider';
import { VitalSigns } from '../types';
import { presetProfiles, defaultVitals } from '../utils/presets';
import { Upload, User, Activity, Droplets, Thermometer, Heart } from 'lucide-react';

interface DashboardProps {
  onAnalyze: (vitals: VitalSigns, imageFile: File | null, scenario: string) => void;
}

export function Dashboard({ onAnalyze }: DashboardProps) {
  const [vitals, setVitals] = useState<VitalSigns>(defaultVitals);
  const [profileLabel, setProfileLabel] = useState('Custom');
  const [scenario, setScenario] = useState<string>('Low');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handlePreset = (preset: 'low' | 'mid' | 'high') => {
    const profile = presetProfiles[preset];
    setVitals(profile.vitals);
    setProfileLabel(profile.label);
    setScenario(preset === 'low' ? 'Low' : preset === 'mid' ? 'Mid' : 'High');
  };

  const handleReset = () => {
    setVitals(defaultVitals);
    setProfileLabel('Custom');
    setScenario('Low');
    setImageFile(null);
  };

  const updateVital = (key: keyof VitalSigns, value: number) => {
    setVitals({ ...vitals, [key]: value });
    setProfileLabel('Custom');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">


        <SectionCard title="MY HEALTH PROFILE" icon={<User size={28} />}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button 
              onClick={() => handlePreset('low')}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-center flex flex-col items-center gap-2 ${scenario === 'Low' ? 'border-success bg-success-light text-success shadow-sm' : 'border-clinical-200 text-clinical-600 hover:border-success/50 hover:bg-clinical-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">L</div>
              LOW RISK
            </button>
            <button 
              onClick={() => handlePreset('mid')}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-center flex flex-col items-center gap-2 ${scenario === 'Mid' ? 'border-warning bg-warning-light text-warning shadow-sm' : 'border-clinical-200 text-clinical-600 hover:border-warning/50 hover:bg-clinical-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">M</div>
              MID RISK
            </button>
            <button 
              onClick={() => handlePreset('high')}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-center flex flex-col items-center gap-2 ${scenario === 'High' ? 'border-danger bg-danger-light text-danger shadow-sm' : 'border-clinical-200 text-clinical-600 hover:border-danger/50 hover:bg-clinical-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center">H</div>
              HIGH RISK
            </button>
            <button 
              onClick={handleReset}
              className={`p-4 rounded-xl border-2 font-bold transition-all text-center flex flex-col items-center gap-2 ${profileLabel === 'Custom' ? 'border-clinical-500 bg-clinical-100 text-clinical-800 shadow-sm' : 'border-clinical-200 text-clinical-600 hover:border-clinical-400 hover:bg-clinical-50'}`}
            >
              <div className="w-8 h-8 rounded-full border-2 border-clinical-400 flex items-center justify-center">+</div>
              CUSTOM
            </button>
          </div>

          <div className="bg-gradient-to-br from-clinical-50 to-white p-5 rounded-xl border border-clinical-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="font-bold text-clinical-500 mb-1 text-sm uppercase tracking-wider">
                My Profile Setup
              </div>
              <div className="text-xl font-extrabold text-clinical-900">
                {profileLabel}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="MY VITALS & READINGS" icon={<Activity size={28} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-clinical-800 font-bold text-lg mb-6 flex items-center gap-2">
                <Heart size={20} className="text-clinical-500" />
                Primary Vitals
              </h3>
              <Slider
                label="Age (years)"
                value={vitals.age}
                min={18}
                max={50}
                onChange={(v) => updateVital('age', v)}
              />
              <Slider
                label="Systolic BP (mmHg)"
                value={vitals.systolicBP}
                min={70}
                max={180}
                onChange={(v) => updateVital('systolicBP', v)}
              />
              <Slider
                label="Diastolic BP (mmHg)"
                value={vitals.diastolicBP}
                min={40}
                max={120}
                onChange={(v) => updateVital('diastolicBP', v)}
              />
            </div>

            <div>
              <h3 className="text-clinical-800 font-bold text-lg mb-6 flex items-center gap-2">
                <Thermometer size={20} className="text-clinical-500" />
                Secondary Vitals
              </h3>
              <Slider
                label="Blood Sugar (mmol/L)"
                value={vitals.bloodSugar}
                min={4}
                max={20}
                step={0.1}
                onChange={(v) => updateVital('bloodSugar', v)}
              />
              <Slider
                label="Body Temperature (°F)"
                value={vitals.bodyTemp}
                min={96}
                max={104}
                step={0.1}
                onChange={(v) => updateVital('bodyTemp', v)}
              />
              <Slider
                label="Heart Rate (bpm)"
                value={vitals.heartRate}
                min={50}
                max={140}
                onChange={(v) => updateVital('heartRate', v)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="HEALTH CONTEXT" icon={<Droplets size={28} />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-clinical-700 font-bold mb-4">
                How are you feeling today?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setScenario('Low')}
                  className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                    scenario === 'Low' || scenario === 'Mid'
                      ? 'border-clinical-500 bg-clinical-50 text-clinical-900 shadow-sm'
                      : 'border-clinical-200 bg-white text-clinical-600 hover:border-clinical-300'
                  }`}
                >
                  Normal / Feeling Good
                </button>
                <button
                  onClick={() => setScenario('High')}
                  className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                    scenario === 'High'
                      ? 'border-danger bg-danger-light text-danger shadow-sm'
                      : 'border-clinical-200 bg-white text-clinical-600 hover:border-danger/30'
                  }`}
                >
                  Experiencing Discomfort or Symptoms
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-clinical-700 font-bold mb-4">
                Upload My Ultrasound
              </h3>
              <label 
                className="flex flex-col flex-1  min-h-[140px] items-center justify-center p-6 border-2 border-dashed border-clinical-300 rounded-xl bg-clinical-50/50 hover:bg-clinical-50 cursor-pointer transition-all group"
              >
                <Upload size={32} className="text-clinical-400 group-hover:text-clinical-600 mb-3 transition-colors" />
                <div className="font-bold text-clinical-700 mb-1 text-center">
                  {imageFile ? 'Ultrasound Uploaded' : 'Upload Ultrasound'}
                </div>
                <div className="text-sm text-clinical-500 text-center">
                  PNG, JPG, JPEG
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </SectionCard>

        <div className="text-center mt-10 mb-20">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onAnalyze(vitals, imageFile, scenario)}
            className="w-full sm:w-auto sm:min-w-[320px] text-lg shadow-elevated"
          >
            GET MY ASSESSMENT
          </Button>
        </div>
      </div>
    </div>
  );
}
