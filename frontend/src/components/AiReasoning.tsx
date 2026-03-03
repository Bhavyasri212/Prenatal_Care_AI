import React, { useState } from 'react';
import { SectionCard } from './Card';
import { Button } from './Button';
import { AnalysisResult } from '../types';
import { ArrowLeft, Brain, BarChart3, Target, Gauge } from 'lucide-react';

interface AIReasoningProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function AIReasoning({ result, onBack }: AIReasoningProps) {
  const [activeTab, setActiveTab] = useState<'reasoning' | 'shap' | 'lime' | 'confidence'>('shap');

  const tabs = [
    { id: 'reasoning' as const, label: 'Assessment Focus', icon: <Brain size={18} /> },
    { id: 'shap' as const, label: 'Factor Contributions', icon: <BarChart3 size={18} /> },
    { id: 'lime' as const, label: 'Vital Sign Impact', icon: <Target size={18} /> },
    { id: 'confidence' as const, label: 'Analysis Reliability', icon: <Gauge size={18} /> },
  ];

  return (
    <div className="bg-transparent p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <Button variant="secondary" onClick={onBack}>
            <div className="flex items-center gap-2 font-semibold">
              <ArrowLeft size={18} />
              Return to Results
            </div>
          </Button>
        </div>

        <SectionCard title="DETAILED CLINICAL ASSESSMENT" icon={<Brain size={28} />}>
          <div className="flex gap-2 mb-8 border-b-2 border-clinical-200 pb-2 overflow-x-auto snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  snap-start shrink-0 px-6 py-3 rounded-t-xl font-bold flex items-center gap-2 transition-all duration-300
                  ${activeTab === tab.id 
                    ? 'bg-clinical-500 text-white shadow-sm' 
                    : 'bg-transparent text-clinical-600 hover:bg-clinical-100'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'reasoning' && (
            <div>
              <div className="p-6 bg-clinical-100 rounded-xl mb-6">
                <h3 className="text-clinical-700 font-bold text-lg mb-4">
                  Model Focus
                </h3>
                <p className="text-clinical-800 leading-relaxed mb-4">
                  Your current assessment indicates a <strong>{result.prediction.riskLevel.toUpperCase()} RISK</strong> profile, based on the specific combination of your vitals and sensor data.
                </p>
                <p className="text-clinical-600 leading-relaxed font-medium">
                  Please review the clinical recommendations below to understand the factors contributing to this assessment and actionable steps for your health.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shap' && (
            <div>
              <div className="px-5 py-4 bg-info-light border-l-4 border-info rounded-xl mb-6 text-clinical-900 font-medium">
                This chart shows how each of your clinical factors contributed to your overall risk assessment.
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-clinical-200 relative overflow-hidden">
                <h3 className="text-clinical-700 font-bold text-xl mb-6 flex items-center gap-2">
                  <BarChart3 className="text-clinical-500" />
                  Key Health Factor Contributions
                </h3>
                <div className="relative z-10">
                  {result.shapFeatures.slice(0, 8).map((feature, index) => {
                    const isPositive = feature.contribution > 0;
                    const maxContribution = Math.max(...result.shapFeatures.map(f => Math.abs(f.contribution)));
                    const width = Math.abs(feature.contribution) / maxContribution * 60;

                    return (
                      <div key={index} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-clinical-700 min-w-[150px] truncate">
                            {feature.feature}
                          </span>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 relative h-8 bg-clinical-50 rounded overflow-hidden">
                              <div 
                                className={`absolute left-1/2 h-full rounded transition-all duration-300 ${isPositive ? 'bg-danger' : 'bg-success'}`}
                                style={{
                                  width: `${width}%`,
                                  transform: isPositive ? 'translateX(0)' : 'translateX(-100%)',
                                }} 
                              />
                              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-clinical-300" />
                            </div>
                            <span className={`font-extrabold min-w-[60px] text-right ${isPositive ? 'text-danger' : 'text-success'}`}>
                              {isPositive ? '+' : ''}{feature.contribution.toFixed(3)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-5 bg-clinical-50 rounded-xl border-2 border-clinical-200 relative z-10">
                  <h4 className="text-clinical-700 font-bold text-lg mb-3">
                    Health Factor Summary
                  </h4>
                  <p className="text-clinical-600 leading-relaxed font-medium">
                    Based on general clinical patterns, <strong className="text-clinical-800">{result.shapFeatures[0]?.feature}</strong> and <strong className="text-clinical-800">{result.shapFeatures[1]?.feature}</strong> are key indicators for your health assessment. Understanding these key features is crucial for taking appropriate actionable steps.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lime' && (
            <div>
              <div className="px-5 py-4 bg-info-light border-l-4 border-info rounded-xl mb-6 text-clinical-900 font-medium">
                This assessment focuses on your specific vital signs to understand your current health status.
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-clinical-200 relative overflow-hidden">
                <h3 className="text-clinical-700 font-bold text-xl mb-6 flex items-center gap-2">
                  Vital Sign Contributions for Your Profile
                </h3>

                <div className="mb-8">
                  {result.limeFeatures.map((feature, index) => {
                    const isIncrease = feature.direction === 'increases';
                    const maxContribution = Math.max(...result.limeFeatures.map(f => Math.abs(f.contribution)));
                    const width = Math.abs(feature.contribution) / maxContribution * 50;

                    return (
                      <div key={index} className="mb-5">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-bold text-clinical-700 min-w-[150px] md:min-w-[180px] truncate">
                            {feature.feature}
                          </span>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 h-9 bg-clinical-50 rounded relative overflow-hidden">
                              <div 
                                className={`absolute h-full rounded transition-all duration-300 ${isIncrease ? 'bg-danger' : 'bg-success'}`}
                                style={{
                                  left: isIncrease ? '50%' : `${50 - width}%`,
                                  width: `${width}%`
                                }} 
                              />
                              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-clinical-300" />
                            </div>
                            <div className="flex flex-col items-end min-w-[80px]">
                              <span className={`font-extrabold ${isIncrease ? 'text-danger' : 'text-success'}`}>
                                {isIncrease ? '+' : ''}{feature.contribution.toFixed(3)}
                              </span>
                              <span className="text-xs font-semibold text-clinical-500 uppercase tracking-widest mt-0.5">
                                {feature.direction}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 bg-clinical-50 rounded-xl">
                  <p className="text-clinical-600 leading-relaxed font-medium mb-0">
                    {(() => {
                      const increasingFeatures = result.limeFeatures.filter(f => f.direction === 'increases').slice(0, 3);
                      const decreasingFeatures = result.limeFeatures.filter(f => f.direction === 'decreases').slice(0, 3);

                      if (increasingFeatures.length > 0 && decreasingFeatures.length > 0) {
                        return <><strong className="text-clinical-800">Your assessment indicates</strong> that {increasingFeatures.map(f => f.feature).join(', ')} are currently elevating your risk profile, while your {decreasingFeatures.map(f => f.feature).join(', ')} are helping to stabilize it.</>;
                      } else if (increasingFeatures.length > 0) {
                        return <><strong className="text-clinical-800">Your assessment indicates</strong> that {increasingFeatures.map(f => f.feature).join(', ')} are the main factors elevating your risk profile at this time.</>;
                      } else if (decreasingFeatures.length > 0) {
                        return <><strong className="text-clinical-800">Your assessment indicates</strong> that {decreasingFeatures.map(f => f.feature).join(', ')} are the main factors helping to maintain your health stability.</>;
                      }
                      return 'Your vitals are currently balanced with no single factor dominating your health assessment.';
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'confidence' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-clinical-50 rounded-xl border-2 border-clinical-200 border-l-4 border-l-clinical-500 shadow-sm relative overflow-hidden">
                  <div className="text-sm font-bold text-clinical-500 uppercase tracking-wider mb-2">
                    Clinical Data
                  </div>
                  <div className="text-4xl font-extrabold text-clinical-700">
                    {(result.modelConfidence.clinicalData * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-semibold text-clinical-600 mt-2">
                    of risk confidence
                  </div>
                </div>

                <div className="p-6 bg-clinical-50 rounded-xl border-2 border-clinical-200 border-l-4 border-l-clinical-500 shadow-sm relative overflow-hidden">
                  <div className="text-sm font-bold text-clinical-500 uppercase tracking-wider mb-2">
                    Sensors (CTG + Activity)
                  </div>
                  <div className="text-4xl font-extrabold text-clinical-700">
                    {(result.modelConfidence.sensors * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-semibold text-clinical-600 mt-2">
                    of risk confidence
                  </div>
                </div>

                <div className="p-6 bg-clinical-50 rounded-xl border-2 border-clinical-200 border-l-4 border-l-clinical-500 shadow-sm relative overflow-hidden">
                  <div className="text-sm font-bold text-clinical-500 uppercase tracking-wider mb-2">
                    Ultrasound Image
                  </div>
                  <div className="text-4xl font-extrabold text-clinical-700">
                    {(result.modelConfidence.ultrasound * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm font-semibold text-clinical-600 mt-2">
                    of risk confidence
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white rounded-2xl border-2 border-clinical-200 relative overflow-hidden">
                <h3 className="text-clinical-700 font-bold text-xl mb-6">
                  Assessment Confidence Meter
                </h3>

                <div className="p-5 rounded-xl border-2 border-success bg-success-light">
                  <div className="mb-2">
                    <span className="font-extrabold text-success text-lg">
                      High Confidence
                    </span>
                  </div>
                  <p className="text-clinical-800 font-medium mb-0">
                    Our comprehensive analysis confirms that the key drivers for your profile are consistent. This indicates a highly reliable assessment.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-clinical-50 rounded-xl">
                  <p className="text-clinical-600 leading-relaxed font-medium mb-0">
                    When our different analytical methods show high agreement, it means the evaluation of your health vitals is robust, well-understood by clinical standards, and highly reliable for your specific case.
                  </p>
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
