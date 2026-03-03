import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './Card';
import { Apple, Activity, Heart, Info, Loader2, Sparkles, Utensils, Moon, Droplets } from 'lucide-react';
import { toast } from 'sonner';

interface WellnessPlan {
  nutrition: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  physical_activity: string[];
  wellness_tips: string[];
  summary: string;
}

export const Wellness: React.FC = () => {
  const { token } = useAuth();
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWellnessPlan = async () => {
      try {
        const response = await fetch('http://localhost:8000/wellness-plan', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch wellness plan');
        const data = await response.json();
        setPlan(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not load your personalized wellness plan.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchWellnessPlan();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-clinical-600 font-medium animate-pulse">Generating your personalized wellness roadmap...</p>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-clinical-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Your Wellness Roadmap
          </h1>
          <p className="text-clinical-600 mt-2 max-w-2xl">
            {plan.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nutrition Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Utensils className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-clinical-800">Nutrition Guide</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-clinical-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> Breakfast
                </h3>
                <ul className="space-y-2">
                  {plan.nutrition.breakfast.map((item, i) => (
                    <li key={i} className="text-clinical-600 text-sm pl-4 border-l border-green-100">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-clinical-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> Lunch
                </h3>
                <ul className="space-y-2">
                  {plan.nutrition.lunch.map((item, i) => (
                    <li key={i} className="text-clinical-600 text-sm pl-4 border-l border-green-100">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-clinical-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> Dinner
                </h3>
                <ul className="space-y-2">
                  {plan.nutrition.dinner.map((item, i) => (
                    <li key={i} className="text-clinical-600 text-sm pl-4 border-l border-green-100">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-clinical-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> Snacks & Hydration
                </h3>
                <ul className="space-y-2">
                  {plan.nutrition.snacks.map((item, i) => (
                    <li key={i} className="text-clinical-600 text-sm pl-4 border-l border-green-100">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-clinical-800">Physical Activity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {plan.physical_activity.map((activity, i) => (
                 <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-clinical-700 text-sm">
                   <div className="mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                   {activity}
                 </div>
               ))}
            </div>
          </Card>
        </div>

        {/* Wellness Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Heart className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-indigo-900">Holistic Wellness</h2>
            </div>
            
            <div className="space-y-4">
               {plan.wellness_tips.map((tip, i) => (
                 <div key={i} className="flex items-start gap-3">
                    <div className="mt-1">
                      {i % 3 === 0 ? <Moon className="w-4 h-4 text-indigo-400" /> : 
                       i % 3 === 1 ? <Droplets className="w-4 h-4 text-blue-400" /> : 
                       <Info className="w-4 h-4 text-purple-400" />}
                    </div>
                    <p className="text-clinical-700 text-sm leading-relaxed">{tip}</p>
                 </div>
               ))}
            </div>

            <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80">
                <p className="text-xs text-clinical-500 italic">
                  * This plan is AI-generated based on your latest vitals. Always consult with your OB-GYN before making significant changes to your diet or exercise routine.
                </p>
            </div>
          </Card>

          {/* <Card className="p-6 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold text-clinical-800 mb-2">Need Help?</h3>
              <p className="text-sm text-clinical-600 mb-4 text-pretty">Our team is available 24/7 for our premium members to discuss wellness plans.</p>
              <button className="w-full py-2.5 px-4 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Chat with a Wellness Coach
              </button>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 -rotate-12" />
          </Card> */}
        </div>
      </div>
    </div>
  );
};
