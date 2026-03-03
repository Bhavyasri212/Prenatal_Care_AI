import React from 'react';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate?: (view: 'landing' | 'dashboard' | 'reports' | 'settings' | 'login' | 'signup' | 'wellness') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.('landing');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-clinical-200 shadow-sm w-full transition-all">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate?.('landing')}
        >
          <Activity size={32} className="text-primary group-hover:scale-110 transition-transform" />
          <h1 className="text-xl md:text-2xl font-extrabold text-clinical-900 tracking-tight m-0">
            MyPregnancy
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate?.(user ? 'dashboard' : 'login')} 
            className="font-semibold text-clinical-600 hover:text-primary transition-colors focus:outline-none"
          >
            My Dashboard
          </button>
          <button 
            onClick={() => onNavigate?.(user ? 'reports' : 'login')} 
            className="font-semibold text-clinical-600 hover:text-primary transition-colors focus:outline-none"
          >
            My Records
          </button>
          <button 
            onClick={() => onNavigate?.(user ? 'wellness' : 'login')} 
            className="font-semibold text-clinical-600 hover:text-primary transition-colors focus:outline-none"
          >
            Wellness Plan
          </button>
          {/* <button 
            onClick={() => onNavigate?.(user ? 'settings' : 'login')} 
            className="font-semibold text-clinical-600 hover:text-primary transition-colors focus:outline-none"
          >
            Profile
          </button> */}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-clinical-600 font-semibold">
                Hi, {user.name.split(' ')[0]}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate?.('settings')}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold hover:bg-primary/20 transition-colors focus:outline-none border border-primary/20"
                  title="View Profile"
                >
                  <UserIcon size={20} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full bg-clinical-50 flex items-center justify-center text-clinical-400 hover:text-red-500 hover:bg-red-50 transition-all border border-clinical-200"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate?.('login')}
              className="px-6 py-2.5 bg-primary  rounded-xl font-bold hover:bg-primary-600 transition-all shadow-md shadow-primary/20 active:scale-95 text-clinical-600"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
