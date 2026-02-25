import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, ArrowRight, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'student') navigate('/portal');
    else if (selectedRole === 'staff') navigate('/staff-dashboard');
    else navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Lexora</h1>
          <p className="text-black/40 mt-2 text-sm">Select your role to continue to the portal</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl shadow-black/5">
          <div className="flex p-1 bg-black/5 rounded-2xl mb-8">
            <button
              onClick={() => setSelectedRole('student')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all",
                selectedRole === 'student' ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              )}
            >
              <GraduationCap size={14} /> Student
            </button>
            <button
              onClick={() => setSelectedRole('staff')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all",
                selectedRole === 'staff' ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              )}
            >
              <Briefcase size={14} /> Staff
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all",
                selectedRole === 'admin' ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black"
              )}
            >
              <Lock size={14} /> Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder={selectedRole === 'student' ? "student@lexora.com" : "staff@lexora.com"}
                className="w-full px-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-4 bg-black/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none"
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2"
            >
              Sign In as {selectedRole === 'student' ? 'Student' : 'Staff'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 text-center">
            <p className="text-xs text-black/40">
              Don't have an account? <button className="text-black font-bold hover:underline">Contact Administration</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
