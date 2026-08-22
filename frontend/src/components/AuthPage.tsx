import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Upload, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loginIdentifier, setLoginIdentifier] = useState('OIADMN20220000');
  const [password, setPassword] = useState('Admin@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Sign up state (Company only)
  const [companyName, setCompanyName] = useState('Odoo India Technologies');
  const [logoName, setLogoName] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Ameer Admin');
  const [adminEmail, setAdminEmail] = useState('admin@odoo.com');
  const [adminPhone, setAdminPhone] = useState('+91 99999 88888');
  const [signupPass, setSignupPass] = useState('Admin@123');
  const [confirmPass, setConfirmPass] = useState('Admin@123');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const success = await login(loginIdentifier, password);
      if (success) {
        onSuccess();
      } else {
        setErrorMsg('Invalid login credentials. Please check your Login ID and password.');
      }
    } catch {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPass !== confirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setSignupSuccess(true);
    setTimeout(async () => {
      await login('OIADMN20220000', signupPass);
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
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#16171F] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 z-10">
        <div className="w-10 h-10 rounded bg-[#714B67] flex items-center justify-center shadow font-black text-lg text-white">
          <span>D</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Dayflow</span>
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-[#714B67]/30 text-[#C9A9C2] border border-[#714B67]/40 font-mono">
              ODIS-HRMS
            </span>
          </div>
          <p className="text-xs text-zinc-400">Odoo Enterprise Human Resource Operating System</p>
        </div>
      </div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1E1F29] border border-[#2E303E] rounded-lg p-6 shadow-xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {mode === 'signin' ? (
            /* Sign In Page */
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Sign In</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Don't have an Account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg('');
                    }}
                    className="text-[#017E84] hover:underline font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

              {/* Demo Persona Quick Fill */}
              <div className="flex items-center gap-2 p-1 bg-[#16171F] rounded border border-[#2E303E]">
                <button
                  type="button"
                  onClick={() => fillCredentials('ADMIN')}
                  className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                    loginIdentifier.includes('ADMN')
                      ? 'bg-[#714B67] text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('EMPLOYEE')}
                  className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                    loginIdentifier.includes('JODO')
                      ? 'bg-[#714B67] text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Employee Login
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Login ID / Email</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. OIJODO20220001 or name@company.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#714B67] font-mono transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#714B67] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#714B67] hover:bg-[#5B3C53] text-white text-xs font-medium rounded shadow-sm flex items-center justify-center gap-1.5 transition-colors mt-2 cursor-pointer"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          ) : (
            /* Sign Up Page (Company Admin Registration Only) */
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Register Organization</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg('');
                    }}
                    className="text-[#017E84] hover:underline font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>

              {/* Guard Note */}
              <div className="p-2.5 bg-[#714B67]/15 border border-[#714B67]/30 rounded flex items-start gap-2 text-[11px] text-[#C9A9C2]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A9C2] shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Notice:</strong> Self-registration is strictly for new Company Accounts. Normal employees are added internally by HR.
                </span>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3 text-xs">
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
                        className="w-full pl-9 pr-3 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Logo</label>
                    <label className="px-3 py-1.5 bg-[#16171F] border border-[#2E303E] hover:border-zinc-500 rounded text-zinc-300 text-[11px] font-medium flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3 h-3 text-[#017E84]" />
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
                      className="w-full pl-9 pr-3 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Work Email</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Phone</label>
                    <input
                      type="text"
                      required
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 99999..."
                      className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Password</label>
                    <input
                      type="password"
                      required
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Confirm</label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                    />
                  </div>
                </div>

                {signupSuccess ? (
                  <div className="py-2 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 rounded text-center font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Company Registered! Logging in...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#714B67] hover:bg-[#5B3C53] text-white text-xs font-medium rounded shadow-sm flex items-center justify-center gap-1.5 transition-colors mt-2 cursor-pointer"
                  >
                    <span>Create Company Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
