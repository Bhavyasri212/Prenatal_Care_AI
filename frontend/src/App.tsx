import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashborad';
import { Results } from './components/Results';
import { AIReasoning } from './components/AiReasoning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Wellness } from './components/Wellness';
import { VitalSigns, AnalysisResult } from './types';
import { analyzePatient } from './utils/aiEngine';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';

type View = 'landing' | 'dashboard' | 'results' | 'reasoning' | 'reports' | 'settings' | 'login' | 'signup' | 'wellness';

function AppContent() {
  const { user, token, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentVitals, setCurrentVitals] = useState<VitalSigns | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async (vitals: VitalSigns, imageFile: File | null, scenario: string) => {
    if (!token) {
      setCurrentView('login');
      return;
    }
    
    setAnalyzing(true);
    try {
      const result = await analyzePatient(vitals, imageFile, scenario, token);
      setCurrentVitals(vitals);
      setCurrentResult(result);
      setCurrentView('results');
    } catch (error) {
      console.error("Error analyzing patient with backend model:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin" />
        </div>
      );
    }

    if (analyzing) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary rounded-full animate-spin" />
          <div className="text-2xl font-bold text-clinical-800 animate-pulse">
            Analyzing Patient Data...
          </div>
        </div>
      );
    }

    // Protected views
    const protectedViews = ['dashboard', 'results', 'reasoning', 'reports', 'settings', 'wellness'];
    if (protectedViews.includes(currentView) && !user) {
      return <Login onSuccess={() => setCurrentView('dashboard')} onSwitchToSignup={() => setCurrentView('signup')} />;
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'login':
        return <Login onSuccess={() => setCurrentView('dashboard')} onSwitchToSignup={() => setCurrentView('signup')} />;
      case 'signup':
        return <Signup onSuccess={() => setCurrentView('login')} onSwitchToLogin={() => setCurrentView('login')} />;
      case 'results':
        if (currentResult && currentVitals) {
          return (
             <Results
              result={currentResult}
              vitals={currentVitals}
              onBack={() => setCurrentView('dashboard')}
              onViewReasoning={() => setCurrentView('reasoning')}
             />
          );
        }
        return <Dashboard onAnalyze={handleAnalyze} />;
      case 'reasoning':
        if (currentResult) {
          return (
            <AIReasoning
              result={currentResult}
              onBack={() => setCurrentView('results')}
            />
          );
        }
        return <Dashboard onAnalyze={handleAnalyze} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'wellness':
        return <Wellness />;
      case 'dashboard':
      default:
        return <Dashboard onAnalyze={handleAnalyze} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-clinical-50 font-sans mt-20">
      <Header onNavigate={setCurrentView} />
      <Toaster position="top-right" richColors />
      <main className="flex-1 flex flex-col relative w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
