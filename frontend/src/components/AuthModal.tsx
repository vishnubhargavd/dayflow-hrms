import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, Eye, EyeOff, Shield, Sparkles, UserCheck, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('HR');
  const [email, setEmail] = useState('sarah.jenkins@dayflow.com');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [employeeId, setEmployeeId] = useState('OIHR20220001');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500'];

  const handleQuickDemoLogin = (role: Role) => {
    setIsLoading(true);
    const demoEmail = role === 'HR' ? 'sarah.jenkins@dayflow.com' : role === 'ADMIN' ? 'admin@dayflow.com' : 'priya.sharma@dayflow.com';
    const demoName = role === 'HR' ? 'Sarah Jenkins' : role === 'ADMIN' ? 'Ameer Admin' : 'Priya Sharma';
    login(role, demoEmail, demoName);
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login(selectedRole, email, fullName || (selectedRole === 'HR' ? 'Sarah Jenkins' : 'Priya Sharma'));
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isSignUp ? 'Create Dayflow Account' : 'Welcome to Dayflow'}
              </h3>
              <p className="text-xs text-zinc-400">Every workday, perfectly aligned.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Instant Demo Login Access Strip */}
        <div className="p-4 bg-zinc-950/90 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              1-Click Instant Demo Sign In
            </span>
            <span className="text-[10px] text-zinc-500">Instant Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('HR')}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-950/40 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300">HR Admin</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Sarah Jenkins (Full Access)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('EMPLOYEE')}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-sky-950/40 border border-zinc-800 hover:border-sky-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-bold text-white group-hover:text-sky-300">Employee</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">Priya Sharma (Self-Service)</p>
            </button>
          </div>
        </div>

        {/* Role Selector Pill */}
        <div className="p-4 bg-zinc-950/70 border-b border-zinc-800">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Select Persona / Role</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('HR');
                setEmail('sarah.jenkins@dayflow.com');
                setFullName('Sarah Jenkins');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'HR' || selectedRole === 'ADMIN'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>HR Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('EMPLOYEE');
                setEmail('priya.sharma@dayflow.com');
                setFullName('Priya Sharma');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'EMPLOYEE'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Company Employee ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OIPRSH20240004"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Work Email Address *</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-300">Password *</label>
              {!isSignUp && (
                <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 rounded-full ${
                      step < strength ? strengthColors[strength - 1] : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Security Rating: {strengthLabels[Math.max(0, strength - 1)]}</span>
                <span>8+ chars, 1 number, 1 special</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-emerald-600 focus:ring-0"
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isSignUp ? 'Create Account & Continue' : `Sign In to ${selectedRole === 'HR' ? 'HR Admin Portal' : 'Employee Portal'}`}</span>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              {isSignUp ? 'Already have an employee account? Sign In' : "Don't have an account yet? Register"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
