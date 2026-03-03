import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceArea, Legend
} from 'recharts';
import { 
  FileText, Download, Calendar, Activity, 
  AlertCircle, ChevronRight, Filter, Printer,
  TrendingUp, TrendingDown, Clock, Shield, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Button } from './Button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface Assessment {
  id: string;
  timestamp: string;
  date: string;
  vitals: {
    age: number;
    systolic_bp: number;
    diastolic_bp: number;
    blood_sugar: number;
    heart_rate: number;
  };
  prediction: {
    risk_level: 'LOW' | 'MID' | 'HIGH';
    confidence: number;
  };
  fetal_weight: number;
  // Synthetic fields for charts
  systolic: number;
  diastolic: number;
  weight: number;
  blood_sugar: number;
  heart_rate: number;
  risk: 'LOW' | 'MID' | 'HIGH';
}

interface ModalProps {
  assessment: Assessment;
  onClose: () => void;
}

function AssessmentDetailModal({ assessment, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-clinical-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-clinical-100 flex justify-between items-center bg-clinical-50/50">
          <div>
            <h2 className="text-2xl font-bold text-clinical-900">Assessment Detail</h2>
            <p className="text-clinical-500 font-medium">{new Date(assessment.timestamp).toLocaleString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-clinical-200 flex items-center justify-center text-clinical-400 hover:text-clinical-600 transition-colors shadow-sm"
          >
            <Activity size={20} className="rotate-45" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Risk Summary */}
          <div className={`p-6 rounded-2xl border flex items-center gap-6 ${
            assessment.risk === 'LOW' ? 'bg-success/5 border-success/20 text-success' : 
            assessment.risk === 'MID' ? 'bg-warning/5 border-warning/20 text-warning' : 
            'bg-danger/5 border-danger/20 text-danger'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm border border-current`}>
              {assessment.risk === 'LOW' ? <CheckCircle2 size={32} /> : assessment.risk === 'MID' ? <AlertCircle size={32} /> : <AlertCircle size={32} />}
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">AI Prediction Result</div>
              <div className="text-4xl font-black">{assessment.risk} RISK</div>
              <div className="text-sm font-bold mt-1">Confidence: {(assessment.prediction.confidence * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vitals Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-clinical-900 flex items-center gap-2">
                <Activity className="text-primary" size={20} /> Recorded Vitals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-clinical-50 p-4 rounded-xl border border-clinical-100">
                  <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Blood Pressure</div>
                  <div className="text-xl font-bold text-clinical-900">{assessment.vitals.systolic_bp}/{assessment.vitals.diastolic_bp} <span className="text-sm font-medium text-clinical-500 uppercase">mmHg</span></div>
                </div>
                <div className="bg-clinical-50 p-4 rounded-xl border border-clinical-100">
                  <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Blood Sugar</div>
                  <div className="text-xl font-bold text-clinical-900">{assessment.vitals.blood_sugar} <span className="text-sm font-medium text-clinical-500 uppercase">mmol/L</span></div>
                </div>
                <div className="bg-clinical-50 p-4 rounded-xl border border-clinical-100">
                  <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Heart Rate</div>
                  <div className="text-xl font-bold text-clinical-900">{assessment.vitals.heart_rate} <span className="text-sm font-medium text-clinical-500 uppercase">bpm</span></div>
                </div>
                <div className="bg-clinical-50 p-4 rounded-xl border border-clinical-100">
                  <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Patient Age</div>
                  <div className="text-xl font-bold text-clinical-900">{assessment.vitals.age} <span className="text-sm font-medium text-clinical-500 uppercase">yrs</span></div>
                </div>
              </div>
            </div>

            {/* Fetal Status Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-clinical-900 flex items-center gap-2">
                <Activity className="text-primary" size={20} /> Fetal Status
              </h3>
              <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-primary uppercase">Estimated Fetal Weight</div>
                  <TrendingUp className="text-primary" size={24} />
                </div>
                <div className="text-5xl font-black text-clinical-900 mb-2">
                  {assessment.fetal_weight.toLocaleString()}g
                </div>
                <p className="text-clinical-600 font-medium text-sm">
                  Clinical estimate based on multi-modal ultrasound and vitals integration.
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Insights */}
          <div className="bg-clinical-900 text-white rounded-2xl p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/20 pb-4">
              <Shield size={24} className="text-primary-300" /> AI Clinical Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="text-primary-300 font-bold uppercase text-xs tracking-wider">Analysis Conclusion</div>
                <p className="text-clinical-200 leading-relaxed">
                  {assessment.risk === 'LOW' 
                    ? "The AI model finds your current vitals within normal parameters for this trimester. No significant hypertensive or gestational diabetic markers detected."
                    : assessment.risk === 'MID'
                    ? "Slight elevation in biomarkers detected. The model recommends increased frequency of monitoring and dietary review to prevent further escalation."
                    : "The clinical pattern detected requires immediate specialist consultation. Significant risk markers identified in blood pressure and physiological trends."}
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-primary-300 font-bold uppercase text-xs tracking-wider">Primary Drivers</div>
                <div className="flex flex-wrap gap-2">
                  {assessment.vitals.systolic_bp > 130 && <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">Systolic BP</span>}
                  {assessment.vitals.blood_sugar > 8 && <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">Blood Sugar</span>}
                  {assessment.vitals.heart_rate > 100 && <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">Heart Rate</span>}
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">Ultrasound Morphology</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-clinical-100 flex justify-end gap-3 bg-clinical-50/30">
          <Button variant="secondary" onClick={onClose} className="rounded-xl px-6">Close</Button>
          <Button onClick={() => window.print()} className="rounded-xl px-6 flex items-center gap-2">
            <Printer size={18} /> Print Record
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Reports() {
  const { token } = useAuth();
  const [data, setData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef<HTMLDivElement>(null);

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My_Pregnancy_Health_Report',
  });

  useEffect(() => {
    // Fetch from FastAPI backend
    const fetchData = async () => {
      
      if (!token) {
        setLoading(false);
        toast.error('Authentication required to fetch data.');
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Session expired. Please sign in again.');
            return;
          }
          throw new Error('Failed to fetch data');
        }
        const dbData = await response.json();
        
        // Map backend data to frontend Assessment interface
        const formattedData: Assessment[] = dbData.map((item: any) => {
          const d = new Date(item.timestamp);
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            id: item.id || item._id,
            timestamp: item.timestamp,
            date: dateStr,
            vitals: item.vitals,
            prediction: item.prediction,
            fetal_weight: item.fetal_weight,
            systolic: item.vitals.systolic_bp,
            diastolic: item.vitals.diastolic_bp,
            weight: item.fetal_weight,
            blood_sugar: item.vitals.blood_sugar,
            heart_rate: item.vitals.heart_rate,
            risk: item.prediction.risk_level.toUpperCase()
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching patient history", error);
        toast.error('Failed to load assessment history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const statCards = [
    { title: 'Past Assessments', value: data.length.toString(), trend: 'Latest Entry', icon: <Calendar size={20} /> },
    { title: 'Current Risk Level', value: data.length > 0 ? data[0].risk : 'N/A', trend: 'Stable', icon: <Shield size={20} /> },
    { title: 'Gestation Progress', value: 'Monitoring', trend: 'Trimester 2', icon: <Activity size={20} /> },
    { title: 'Health Status', value: 'Active', trend: 'Good', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-8 animate-fade-in pb-20 relative">
      {selectedAssessment && (
        <AssessmentDetailModal 
          assessment={selectedAssessment} 
          onClose={() => setSelectedAssessment(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-clinical-900 tracking-tight">My Health History</h1>
          <p className="text-clinical-600 mt-1">Track your vitals and past assessments over time.</p>
        </div>
        <div className="flex items-center gap-3 border border-clinical-200 bg-white p-1 rounded-full shadow-sm">
           <Button variant="secondary" onClick={() => toast.info('Filtering functionality coming soon')} className="flex items-center gap-2 border-none bg-transparent hover:bg-clinical-50 text-clinical-700 shadow-none rounded-full px-4">
            <Filter size={16} /> Filter
          </Button>
          <div className="w-px h-6 bg-clinical-200 mx-1"></div>
          <Button onClick={() => handlePrint()} className="flex items-center gap-2 rounded-full px-5">
            <Download size={16} /> Export PDF
          </Button>
        </div>
      </div>

      <div ref={componentRef} className="space-y-8 bg-clinical-50/50 -m-4 p-4 rounded-3xl" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
        {/* Print-Only Clinical Header */}
        <div className="hidden print:block border-b-4 border-clinical-900 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-clinical-900 uppercase">Clinical Health Summary</h1>
              <p className="text-clinical-600 font-bold tracking-widest mt-1">MATERNAL HEALTH AI DIAGNOSTIC REPORT</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-clinical-500 uppercase">Patient ID</div>
              <div className="text-lg font-black text-clinical-900">#P-002934-M</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-8 bg-clinical-50 p-4 rounded-xl border border-clinical-200">
            <div>
              <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Generated On</div>
              <div className="font-bold text-clinical-900">{new Date().toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Total Records</div>
              <div className="font-bold text-clinical-900">{data.length} Assessments</div>
            </div>
            <div>
              <div className="text-xs font-bold text-clinical-500 uppercase mb-1">Status</div>
              <div className="font-bold text-success">Active Monitoring</div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-sm animate-pulse h-[120px]"></div>
             ))
          ) : (
            statCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-clinical-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-clinical-900 uppercase">{stat.value}</h3>
                  <p className="text-sm mt-2 font-medium text-clinical-600">
                    {stat.trend}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-clinical-50 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Doctor's Advice Health Summary */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col md:flex-row items-center md:items-start gap-5 shadow-sm">
           <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 border border-clinical-100">
             <CheckCircle2 className="text-success w-7 h-7" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-clinical-900 mb-2 flex items-center gap-2 pt-1">Health Summary & Doctor's Advice</h3>
             <p className="text-clinical-700 leading-relaxed max-w-4xl font-medium">
               Your pregnancy vitals are being tracked securely. Review your trends below to see how your blood pressure and fetal weight estimates are progressing throughout your trimesters.
             </p>
           </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-sm h-96 animate-pulse"></div>
        ) : data.length === 0 ? (
           <div className="bg-white rounded-2xl p-12 border border-clinical-100 shadow-sm flex flex-col items-center justify-center text-center">
             <FileText className="w-16 h-16 text-clinical-300 mb-4" />
             <h3 className="text-xl font-bold text-clinical-900 mb-2">No Assessments Yet</h3>
             <p className="text-clinical-600 max-w-md mx-auto mb-6">Take your first assessment to start tracking your pregnancy journey privately.</p>
             <Button className="px-8" onClick={() => window.location.reload()}><Activity className="w-4 h-4 mr-2" /> Refresh Dashboard</Button>
           </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-sm h-96 flex flex-col relative overflow-hidden">
                <h3 className="text-lg font-bold text-clinical-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Blood Pressure Trends
                </h3>
                <div className="flex-1 w-full min-h-0 relative -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis domain={[60, 160]} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <ReferenceArea y1={90} y2={120} fill="#22C55E" fillOpacity={0.05} />
                      <Line type="monotone" name="Systolic (mmHg)" dataKey="systolic" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="Diastolic (mmHg)" dataKey="diastolic" stroke="#94A3B8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-sm h-96 flex flex-col relative overflow-hidden">
                <h3 className="text-lg font-bold text-clinical-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" /> Fetal Weight Progress
                </h3>
                <div className="flex-1 w-full min-h-0 relative -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}
                      />
                      <Area type="monotone" name="Fetal Weight (g)" dataKey="weight" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-sm h-96 flex flex-col relative overflow-hidden">
                <h3 className="text-lg font-bold text-clinical-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-warning" /> BS & Heart Rate Stability
                </h3>
                <div className="flex-1 w-full min-h-0 relative -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis yAxisId="left" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '8px' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Line yAxisId="left" type="monotone" name="Blood Sugar (mmol/L)" dataKey="blood_sugar" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" name="Heart Rate (bpm)" dataKey="heart_rate" stroke="#EC4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-clinical-100 shadow-sm flex flex-col h-96">
                <div className="p-6 border-b border-clinical-100 flex justify-between items-center bg-white rounded-t-2xl">
                  <h3 className="text-lg font-bold text-clinical-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Detailed Assessment Log
                  </h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Securely Stored
                  </span>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-clinical-50/80 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="p-4 text-xs font-bold text-clinical-500 uppercase tracking-wider">Date</th>
                        <th className="p-4 text-xs font-bold text-clinical-500 uppercase tracking-wider">Risk Level</th>
                        <th className="p-4 text-xs font-bold text-clinical-500 uppercase tracking-wider">Weight</th>
                        <th className="p-4 text-xs font-bold text-clinical-500 uppercase tracking-wider">BP</th>
                        <th className="p-4 text-xs font-bold text-clinical-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-clinical-100">
                      {data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-clinical-50/50 transition-colors">
                          <td className="p-4 text-sm font-semibold text-clinical-800">{row.date}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase flex w-fit items-center gap-1 border ${row.risk === 'LOW' ? 'bg-success/10 text-success border-success/20' : row.risk === 'MID' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                              {row.risk === 'LOW' ? '✅ Low' : row.risk === 'MID' ? '⚠️ Elevated' : '🚨 High'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-clinical-600 font-medium">{row.weight.toLocaleString()}g</td>
                          <td className="p-4 text-sm font-medium">
                            <span className={row.systolic > 120 ? 'text-warning font-bold' : 'text-success font-bold'}>
                              {row.systolic}
                            </span>
                            <span className="text-clinical-400 mx-0.5">/</span>
                            <span className={row.diastolic > 80 ? 'text-warning font-bold' : 'text-clinical-700 font-bold'}>
                              {row.diastolic}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => setSelectedAssessment(row)}
                              className="text-primary hover:text-primary/80 text-sm font-bold flex items-center justify-end gap-1 group w-full transition-colors focus:outline-none"
                            >
                              View <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Print-Only Signature Footer */}
        <div className="hidden print:block mt-12 pt-8 border-t border-clinical-200">
          <div className="grid grid-cols-2 gap-20">
            <div>
              <div className="h-px bg-clinical-900 mb-2"></div>
              <div className="text-xs font-bold text-clinical-500 uppercase">Consulting Physician Signature</div>
            </div>
            <div>
              <div className="h-px bg-clinical-900 mb-2"></div>
              <div className="text-xs font-bold text-clinical-500 uppercase">Facility Stamp & Date</div>
            </div>
          </div>
          <div className="mt-8 text-[10px] text-clinical-400 text-center italic">
            This report was generated by the Prenatal Care AI Diagnostic System. Clinical validation by a healthcare professional is required for diagnostic corellation.
          </div>
        </div>
      </div>
<style>{`
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
`}</style>
    </div>
  );
}
