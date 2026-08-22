import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, Upload, Lock, Mail, Phone, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { switchRole } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loginIdentifier, setLoginIdentifier] = useState('OIADMN20220000');
  const [password, setPassword] = useState('Admin@123');
  
  // Sign up state
  const [companyName, setCompanyName] = useState('Odoo India Technologies');
  const [logoName, setLogoName] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Ameer Admin');
  const [adminEmail, setAdminEmail] = useState('admin@odoo.com');
  const [adminPhone, setAdminPhone] = useState('+91 99999 88888');
  const [signupPass, setSignupPass] = useState('Admin@123');
  const [confirmPass, setConfirmPass] = useState('Admin@123');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginIdentifier.includes('ADMN') || loginIdentifier.includes('admin')) {
      switchRole('ADMIN');
    } else {
      switchRole('EMPLOYEE');
    }
    onSuccess();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupSuccess(true);
    setTimeout(() => {
      switchRole('ADMIN');
      onSuccess();
    }, 1200);
  };

  const fillCredentials = (role: 'ADMIN' | 'EMPLOYEE') => {
    if (role === 'ADMIN') {
      setLoginIdentifier('OIADMN20220000');
      setPassword('Admin@123');
    } else {
      setLoginIdentifier('OIJODO20220001');
      setPassword('Employee@123');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white">DAYFLOW</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              ODIS-HRMS
            </span>
          </div>
          <p className="text-xs text-zinc-400">Enterprise HR & Attendance Operating System</p>
        </div>
      </div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {mode === 'signin' ? (
            /* Sign In Page */
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Don't have an Account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

              {/* Quick Persona Fill Buttons */}
              <div className="flex items-center gap-2 p-1.5 bg-zinc-950 rounded-xl border border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => fillCredentials('ADMIN')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    loginIdentifier.includes('ADMN')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('EMPLOYEE')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    loginIdentifier.includes('JODO')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Employee Demo
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Login ID / Email</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. OIJODO20220001 or name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 font-mono transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                >
                  <span>Sign In to Workplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          ) : (
            /* Sign Up Page (Admin / Company Registration Only) */
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Register Organization</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>

              {/* Guard Note */}
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-start gap-2 text-[11px] text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Notice:</strong> Self-registration is strictly for new Company Accounts. Regular employees are created by HR inside the workplace.
                </span>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
                {/* Company Name & Logo Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-zinc-400 mb-1 font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Logo</label>
                    <label className="px-3 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 text-[11px] font-medium flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>{logoName ? 'Uploaded' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setLogoName(e.target.files?.[0]?.name || 'logo.png')}
                      />
                    </label>
                  </div>
                </div>

                {/* Administrator Name */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Admin Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Ameer Admin"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Work Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@company.com"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="+91 99999..."
                        className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Password</label>
                    <input
                      type="password"
                      required
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Confirm Pass</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {signupSuccess ? (
                  <div className="py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Company Registered! Launching...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                  >
                    <span>Create Company Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
