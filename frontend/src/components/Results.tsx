import React from 'react';
import { SectionCard, Card } from './Card';
import { Alert } from './Alert';
import { Button } from './Button';
import { AnalysisResult, VitalSigns } from '../types';
import { TrendingUp, Baby, PieChart, FileText, Lightbulb, ArrowLeft, BrainCircuit, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultsProps {
  result: AnalysisResult;
  vitals: VitalSigns;
  onBack: () => void;
  onViewReasoning: () => void;
}

export function Results({ result, vitals, onBack, onViewReasoning }: ResultsProps) {
  if (!result || !result.prediction) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-clinical-900">Analysis Data Unavailable</h2>
        <p className="text-clinical-600 mt-2">We couldn't retrieve your latest assessment. Please try again.</p>
        <Button onClick={onBack} className="mt-6">Return to Dashboard</Button>
      </div>
    );
  }

  const { prediction, findings, recommendations, whatIfSuggestions, patientAdvice } = result;

  const getRiskColor = (level: string) => {
    if (level === 'low') return 'text-success';
    if (level === 'mid') return 'text-warning';
    return 'text-danger';
  };

  const getRiskBorder = (level: string) => {
    if (level === 'low') return 'border-success';
    if (level === 'mid') return 'border-warning';
    return 'border-danger';
  };

  const getRiskBackground = (level: string) => {
    if (level === 'low') return 'bg-success-light';
    if (level === 'mid') return 'bg-warning-light';
    return 'bg-danger-light';
  };

  const getRiskLabel = (level: string) => {
    if (level === 'low') return 'LOW RISK';
    if (level === 'mid') return 'MID RISK';
    return 'HIGH RISK';
  };

  const getRiskIcon = (level: string) => {
    if (level === 'low') return '✅';
    if (level === 'mid') return '⚠️';
    return '🚨';
  };

  return (
    <div className="bg-transparent p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between print:hidden">
          <Button variant="secondary" onClick={onBack}>
            <div className="flex items-center gap-2 font-semibold">
              <ArrowLeft size={18} />
              Return to Dashboard
            </div>
          </Button>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => window.print()}>
              <div className="flex items-center gap-2 font-bold shadow-sm">
                <FileText size={18} />
                Download PDF
              </div>
            </Button>
            <Button variant="primary" onClick={onViewReasoning}>
              <div className="flex items-center gap-2 font-bold shadow-sm">
                <BrainCircuit size={18} />
                Detailed Assessment
              </div>
            </Button>
          </div>
        </div>

        <SectionCard title="ANALYSIS RESULTS" icon={<TrendingUp size={28} />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md" hover className="flex flex-col">
              <div className="text-clinical-700 text-xl font-bold mb-5 flex items-center gap-3">
                <TrendingUp size={24} className="text-clinical-500" />
                RISK ASSESSMENT
              </div>
              
              <div className={`p-6 rounded-xl border-l-8 ${getRiskBorder(prediction.riskLevel)} ${getRiskBackground(prediction.riskLevel)} flex-grow`}>
                <div className={`text-2xl font-extrabold mb-2 ${getRiskColor(prediction.riskLevel)}`}>
                  {getRiskIcon(prediction.riskLevel)} {getRiskLabel(prediction.riskLevel)}
                </div>
                <div className="text-lg font-bold text-clinical-700">
                  Confidence: <span className="text-clinical-900">{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="mt-5 bg-clinical-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    prediction.riskLevel === 'low' ? 'bg-success' : 
                    prediction.riskLevel === 'mid' ? 'bg-warning' : 'bg-danger'
                  }`}
                  style={{ width: `${prediction.confidence * 100}%` }} 
                />
              </div>
            </Card>

            <Card padding="md" hover className="flex flex-col">
              <div className="text-clinical-700 text-xl font-bold mb-5 flex items-center gap-3">
                <Baby size={24} className="text-clinical-500" />
                FETAL GROWTH
              </div>
              
              {prediction.fetalWeight !== null ? (
                <>
                  <div className="text-center py-5 flex-grow flex flex-col justify-center">
                    <div className="text-5xl font-extrabold text-clinical-600 mb-2">
                      {prediction.fetalWeight.toFixed(0)}g
                    </div>
                    <div className="text-lg font-bold text-clinical-500">
                      Estimated Fetal Weight
                    </div>
                  </div>
                  {prediction.fetalWeight < 2500 ? (
                    <Alert type="warning" title="Low birth weight detected">
                      Weight is below the 10th percentile for gestational age. Monitoring recommended.
                    </Alert>
                  ) : (
                    <Alert type="success" title="Weight within normal range">
                      Fetal growth trajectory is standard.
                    </Alert>
                  )}
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-clinical-50 rounded-full flex items-center justify-center text-clinical-300 mb-4 border-2 border-dashed border-clinical-200">
                    <Baby size={32} />
                  </div>
                  <h4 className="text-clinical-900 font-bold mb-2">Detailed Scan Required</h4>
                  <p className="text-clinical-500 text-sm font-medium leading-relaxed">
                    Please upload an ultrasound image to enable AI-powered fetal weight estimation.
                  </p>
                </div>
              )}
            </Card>

            <Card padding="md" hover className="flex flex-col">
              <div className="text-clinical-700 text-xl font-bold mb-5 flex items-center gap-3">
                <PieChart size={24} className="text-clinical-500" />
                RISK DISTRIBUTION
              </div>
              <div className="mt-2 flex-grow flex flex-col justify-center gap-4">
                <div>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-bold text-clinical-700">Low Risk</span>
                    <span className="font-extrabold text-success">
                      {(prediction.probabilities.low * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-clinical-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success transition-all duration-1000"
                      style={{ width: `${prediction.probabilities.low * 100}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-bold text-clinical-700">Mid Risk</span>
                    <span className="font-extrabold text-warning">
                      {(prediction.probabilities.mid * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-clinical-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-warning transition-all duration-1000"
                      style={{ width: `${prediction.probabilities.mid * 100}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-bold text-clinical-700">High Risk</span>
                    <span className="font-extrabold text-danger">
                      {(prediction.probabilities.high * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-clinical-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-danger transition-all duration-1000"
                      style={{ width: `${prediction.probabilities.high * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </SectionCard>

        {/* Narrative Summary - The "Story" */}
        {patientAdvice && (
          <SectionCard title="YOUR HEALTH STORY" icon={<BrainCircuit size={28} className="text-primary" />}>
            <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <BrainCircuit size={120} />
               </div>
               <h3 className="text-2xl font-black text-clinical-900 mb-4">Current Assessment Summary</h3>
               <p className="text-xl text-clinical-800 leading-relaxed font-medium max-w-4xl relative z-10 italic">
                 "{prediction.riskLevel === 'low' ? '✨' : prediction.riskLevel === 'mid' ? '⚠️' : '🚨'} {patientAdvice.conditionSummary}"
               </p>
            </div>
          </SectionCard>
        )}

        <SectionCard title="HEALTH METRICS BREAKDOWN" icon={<Activity size={28} className="text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {findings.map((finding, index) => {
              const alertType = finding.category === 'critical' ? 'error' : finding.category === 'warning' ? 'warning' : 'success';
              return (
                <div key={index} className={`p-4 rounded-xl border flex items-center gap-4 ${
                  alertType === 'error' ? 'bg-danger/5 border-danger/20 text-danger' : 
                  alertType === 'warning' ? 'bg-warning/5 border-warning/20 text-warning' : 
                  'bg-success/5 border-success/20 text-success'
                }`}>
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                     {alertType === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                   </div>
                   <div>
                      <div className="font-bold text-lg leading-tight">{finding.title}</div>
                      <div className="text-sm opacity-80">{finding.detail} ({finding.value.toFixed(finding.metric === 'bloodSugar' ? 1 : 0)} 
                        {finding.metric === 'systolicBP' || finding.metric === 'diastolicBP' ? 'mmHg' : 
                         finding.metric === 'bloodSugar' ? 'mmol/L' : 
                         finding.metric === 'heartRate' ? 'bpm' : '°F'})
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {patientAdvice && (
          <SectionCard title="YOUR ACTION PLAN" icon={<Lightbulb size={28} className="text-warning" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-clinical-900 font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-success" /> Immediate Steps
                </h4>
                <ul className="space-y-3">
                  {patientAdvice.immediateActions.map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-white border border-clinical-100 rounded-xl shadow-sm hover:border-clinical-200 transition-colors">
                      <span className="w-7 h-7 rounded-full bg-success/10 text-success flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-clinical-800 font-bold">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-clinical-900 font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" /> Long-term Wellness Goals
                </h4>
                <ul className="space-y-3">
                  {patientAdvice.longTermGoals.map((goal: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-white border border-clinical-100 rounded-xl shadow-sm hover:border-clinical-200 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp size={14} />
                      </div>
                      <span className="text-clinical-800 font-bold">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        )}

        {whatIfSuggestions && whatIfSuggestions.length > 0 && (
          <SectionCard title="PROACTIVE HEALTH STRATEGIES" icon={<TrendingUp size={28} />}>
            <Alert type="info" title="Targeted Health Goals">
              Our clinical analysis suggests that adjusting the following vitals could positively improve your overall health and lower your risk profile:
            </Alert>
            <ul className="mt-4 space-y-3">
              {whatIfSuggestions.map((suggestion, index) => (
                <li key={index} className="p-4 bg-white border-2 border-clinical-200 rounded-xl font-bold text-clinical-800 shadow-sm hover:border-clinical-400 transition-colors">
                  {suggestion}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
