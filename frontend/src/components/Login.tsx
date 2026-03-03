import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const { access_token } = await response.json();
      
      // Fetch user data
      const userResponse = await fetch('http://localhost:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });
      
      const userData = await userResponse.json();
      login(access_token, userData);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-clinical-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-clinical-100 overflow-hidden transform transition-all hover:shadow-2xl">
        <div className="p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white relative h-32 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-clinical-600 font-bold">Welcome Back</h2>
            <p className="text-primary-100 text-sm text-clinical-600">Sign in to your prenatal journey</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <LogIn className="w-8 h-8 text-clinical-600" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-clinical-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-clinical-50 border border-clinical-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-clinical-800"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-clinical-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-400 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-clinical-50 border border-clinical-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-clinical-800"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-clinical-600 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In 
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-clinical-500 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
