import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      toast.success('Account created successfully! Please sign in.');
      onSwitchToLogin();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-clinical-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-clinical-100 overflow-hidden transform transition-all hover:shadow-2xl">
        <div className="p-8 bg-gradient-to-br from-clinical-600 to-clinical-700 text-white relative h-32 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Start Your Journey</h2>
            <p className="text-clinical-100 text-sm">Join the prenatal care community</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <UserPlus className="w-8 h-8" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-clinical-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400 group-focus-within:text-clinical-600 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-clinical-50 border border-clinical-200 rounded-2xl focus:ring-2 focus:ring-clinical-500 focus:border-transparent outline-none transition-all text-clinical-800"
                placeholder="Jane Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-clinical-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400 group-focus-within:text-clinical-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-clinical-50 border border-clinical-200 rounded-2xl focus:ring-2 focus:ring-clinical-500 focus:border-transparent outline-none transition-all text-clinical-800"
                placeholder="jane@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-clinical-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400 group-focus-within:text-clinical-600 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-clinical-50 border border-clinical-200 rounded-2xl focus:ring-2 focus:ring-clinical-500 focus:border-transparent outline-none transition-all text-clinical-800"
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-clinical-600 text-white rounded-2xl font-bold shadow-lg shadow-clinical/30 hover:bg-clinical-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <UserPlus className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-clinical-500 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-clinical-600 font-bold hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
