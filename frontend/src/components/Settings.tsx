import React from 'react';
import { User, Shield, LogOut } from 'lucide-react';
import { Button } from './Button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-6 md:p-8 animate-fade-in pb-20">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl font-black text-clinical-900 tracking-tight">Account Settings</h1>
        <p className="text-lg text-clinical-600 mt-2 font-medium">Manage your basic account information and security.</p>
      </div>

      <div className="space-y-12">
        {/* Profile Section */}
        <section className="bg-white rounded-[32px] border border-clinical-100 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <User size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-clinical-900 tracking-tight">Your Profile</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-clinical-700 ml-1">Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.name || ''} 
                className="w-full px-5 py-4 rounded-2xl border border-clinical-100 bg-clinical-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-clinical-900 font-semibold" 
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-clinical-700 ml-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''} 
                readOnly 
                className="w-full px-5 py-4 rounded-2xl border border-clinical-100 bg-clinical-50/10 text-clinical-400 font-semibold cursor-not-allowed" 
                title="Email cannot be changed" 
              />
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-clinical-50 flex justify-end">
            <Button 
                onClick={() => toast.success('Profile updated successfully')}
                className="rounded-2xl h-14 px-8 font-black shadow-lg shadow-primary/20"
            >
              Update Profile
            </Button>
          </div>
        </section>

        {/* Security Section
        <section className="bg-white rounded-[32px] border border-clinical-100 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-clinical-900 tracking-tight">Security</h2>
          </div>

          <div className="p-6 rounded-2xl bg-clinical-50/50 border border-clinical-100 flex items-center justify-between group hover:bg-white transition-all hover:shadow-md">
            <div>
              <p className="font-bold text-clinical-900">Change Password</p>
              <p className="text-sm text-clinical-500 font-medium">Protect your account with a secure password</p>
            </div>
            <Button variant="secondary" className="rounded-xl border-clinical-200">
              Update
            </Button>
          </div>
        </section> */}

        {/* Support Section - Simplified */}
        <div className="text-center pt-8">
          <p className="text-clinical-500 font-medium text-sm">
            Need help? Contact our support team at <span className="text-primary font-bold">support@prenatalai.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
