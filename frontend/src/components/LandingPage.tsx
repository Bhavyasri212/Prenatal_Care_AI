import React from 'react';
import { 
  Activity, ArrowRight, Shield, HeartPulse, Stethoscope, 
  CheckCircle2, Users
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './Button';
import heroImage from '../assets/hero_image.png';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.20))]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-12 lg:py-24 gap-12 bg-gradient-to-br from-clinical-50 via-white to-clinical-100">
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clinical-100 text-clinical-700 font-semibold text-sm mb-6 border border-clinical-200">
            <Activity size={16} />
            AI-Enhanced Prenatal Care
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-clinical-900 leading-tight mb-6 tracking-tight">
            Empowering Your Pregnancy Journey
          </h1>
          <p className="text-xl text-clinical-600 mb-10 leading-relaxed font-medium">
            Advanced risk assessment and fetal growth monitoring leveraging AI to provide you with actionable, precise insights about your health and your baby.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onStart} className="text-lg px-8 py-4 shadow-elevated group">
              Start Assessment
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => toast.info('Learn More section is below!')} className="text-lg px-8 py-4 bg-white/50 backdrop-blur-sm border-clinical-200 text-clinical-700 hover:bg-white hover:text-clinical-900">
              Learn More
            </Button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex justify-center lg:justify-end">
          {/* Decorative background elements behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-clinical-200/40 blur-3xl rounded-full -z-10"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-glass border border-white/40 group">
            <img 
              src={heroImage} 
              alt="Maternal Health Illustration" 
              className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {/* Subtle overlay glaze */}
            <div className="absolute inset-0 bg-gradient-to-t from-clinical-900/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-clinical-900 mb-4">Your Comprehensive Care Companion</h2>
            <p className="text-clinical-600 max-w-2xl mx-auto text-lg">Integrated tools designed to keep you informed and empowered throughout your pregnancy.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-clinical-50 border border-clinical-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <HeartPulse className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-clinical-900 mb-3">Vital Tracking</h3>
              <p className="text-clinical-600 leading-relaxed">
                Real-time monitoring of crucial maternal vitals including blood pressure, heart rate, and glucose levels for early risk detection.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-clinical-50 border border-clinical-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Stethoscope className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-clinical-900 mb-3">Multimodal Analysis</h3>
              <p className="text-clinical-600 leading-relaxed">
                Combining tabular vital signs with advanced ultrasound imaging analysis for a holistic view of maternal and fetal health.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-clinical-50 border border-clinical-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Shield className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-clinical-900 mb-3">Secure & Private</h3>
              <p className="text-clinical-600 leading-relaxed">
                Enterprise-grade security ensuring all sensitive health data is processed and stored with the highest privacy standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-clinical-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-clinical-900 mb-4">How it Works</h2>
            <p className="text-clinical-600 max-w-2xl mx-auto text-lg">A simple, streamlined process designed specifically for expectant mothers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection line for large screens */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-clinical-200 -z-10 -translate-y-1/2"></div>
            
            {[
              { step: "1", title: "Data Input", desc: "Securely enter your latest vitals and health history." },
              { step: "2", title: "AI Analysis", desc: "Our advanced AI models analyze your data in real-time." },
              { step: "3", title: "Insights", desc: "Receive immediate, easy-to-understand insights about your health." },
              { step: "4", title: "Action Plan", desc: "Get personalized recommendations to discuss with your doctor." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-clinical-100 shadow-sm relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary text-clinical-500 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto md:mx-0 shadow-md ring-4 ring-blue-100">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-clinical-900 mb-3 text-center md:text-left">{item.title}</h3>
                <p className="text-clinical-600 text-center md:text-left">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-clinical-50 to-transparent -z-10"></div>
        
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-clinical-900 mb-6 leading-tight">
              Backed by Top Healthcare Professionals
            </h2>
            <p className="text-lg text-clinical-600 mb-8 leading-relaxed">
              Our AI platform is built on rigorous medical research and validated by leading obstetricians to ensure you get the most accurate information possible.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Highly accurate early risk detection",
                "Your privacy is our top priority",
                "Easily share reports with your doctor"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0" />
                  <span className="text-clinical-800 font-medium">{text}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="px-8 shadow-sm hover:shadow-md" onClick={() => toast.info('Integration details coming soon!')}>
              View Clinical Evidence
            </Button>
          </div>
          <div className="bg-clinical-50 p-10 rounded-3xl border border-clinical-100 shadow-glass relative">
            <div className="absolute -top-6 -left-6 text-6xl text-primary/20 font-serif">"</div>
            <p className="text-lg md:text-xl text-clinical-800 leading-relaxed italic mb-8 relative z-10">
              "This app gave me so much peace of mind during my pregnancy. Seeing the AI insights helped me know exactly what questions to ask my doctor at my next visit!"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-clinical-200 rounded-full flex items-center justify-center overflow-hidden">
                <Users className="text-clinical-500 w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-clinical-900">Emily R.</h4>
                <p className="text-sm text-clinical-500">First-Time Mother</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-clinical-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white tracking-tight">Ready to Take Control of Your Journey?</h2>
          <p className="text-xl text-clinical-200 mb-10 max-w-2xl mx-auto">
            Join thousands of mothers who are already using our advanced AI to stay informed and empowered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onStart} className="text-lg px-10 py-4 bg-white text-clinical-900 hover:bg-clinical-50 shadow-elevated border-none font-bold">
              Start Free Assessment
            </Button>
            <Button variant="secondary" size="lg" onClick={() => toast.info('Creating account...')} className="text-lg px-10 py-4 border-white/30 text-white hover:bg-white/10 bg-transparent shadow-none">
              Create an Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
