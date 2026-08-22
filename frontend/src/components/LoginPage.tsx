import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Shield,
  UserCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Clock,
  CreditCard,
  CalendarDays,
  Building,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<Role>('HR');
  const [email, setEmail] = useState('sarah.jenkins@dayflow.com');
  const [password, setPassword] = useState('Password@123');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [employeeId, setEmployeeId] = useState('OIHR20230001');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleQuickDemoLogin = (demoRole: Role) => {
    setIsLoading(true);
    setTimeout(() => {
      login(demoRole);
      setIsLoading(false);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(role, email, fullName);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Left Branding & Visual Hero Section */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/40 border-b lg:border-b-0 lg:border-r border-zinc-800/80">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Dayflow
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium tracking-wider uppercase">
              Enterprise HRMS Platform
            </p>
          </div>
        </div>

        {/* Center Hero Message */}
        <div className="my-12 lg:my-0 max-w-lg z-10 space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Role-Based Principle of Least Privilege
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Every workday, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              perfectly aligned.
            </span>
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Unified human resources management tailored with dedicated portals for HR administrators and employees.
          </p>

          {/* Value Props */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span><strong>Separate Role Workspaces:</strong> Dedicated Employee Self-Service & HR Command Center.</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <span><strong>Attendance & Systray:</strong> Real-time clock-in and working hours calculator.</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <CreditCard className="w-4 h-4" />
              </div>
              <span><strong>Statutory Payroll:</strong> Compliant wage engine with downloadable official payslips.</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-zinc-500 z-10 flex items-center justify-between">
          <span>© 2026 Dayflow HRMS. All rights reserved.</span>
          <span>Version 2.4.0 • Enterprise</span>
        </div>
      </div>

      {/* Right Login / Sign Up Card Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md space-y-6">
          {/* Quick Demo Access Bar */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Quick Demo Sign In
              </span>
              <span className="text-[10px] text-zinc-500">Test Personas</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('HR')}
                disabled={isLoading}
                className="p-3 rounded-xl bg-zinc-950 hover:bg-emerald-950/40 border border-zinc-800 hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">HR Officer</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Sarah Jenkins (Full Access)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('EMPLOYEE')}
                disabled={isLoading}
                className="p-3 rounded-xl bg-zinc-950 hover:bg-sky-950/40 border border-zinc-800 hover:border-sky-500/40 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-bold text-white group-hover:text-sky-300">Employee</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Priya Sharma (Self-Service)</p>
              </button>
            </div>
          </div>

          {/* Card Container */}
          <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Tabs */}
            <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
              <button
                onClick={() => {
                  setActiveTab('signin');
                  setRole('HR');
                  setEmail('sarah.jenkins@dayflow.com');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setRole('EMPLOYEE');
                  setEmail('new.employee@dayflow.com');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Role Persona Switcher for Sign In / Sign Up */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">
                Target Role / Access Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('HR');
                    setEmail(activeTab === 'signin' ? 'sarah.jenkins@dayflow.com' : 'new.hr@dayflow.com');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    role === 'HR' || role === 'ADMIN'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>HR Administrator</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('EMPLOYEE');
                    setEmail(activeTab === 'signin' ? 'priya.sharma@dayflow.com' : 'new.employee@dayflow.com');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    role === 'EMPLOYEE'
                      ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Employee (User)</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Company Employee ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OIPRSH20240004"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
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
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-300">Password *</label>
                  {activeTab === 'signin' && (
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
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                    <span>Strength: {strengthLabels[Math.max(0, strength - 1)]}</span>
                    <span>Min 8 chars, 1 num, 1 special</span>
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
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>
                    {activeTab === 'signin'
                      ? `Sign In to ${role === 'HR' ? 'HR Portal' : 'Employee Portal'}`
                      : 'Create Account & Continue'}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
