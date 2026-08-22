import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Lock, User, ArrowRight, X, Eye, EyeOff, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [loginIdOrEmail, setLoginIdOrEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign Up State
  const [fullName, setFullName] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showSignupPass, setShowSignupPass] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdOrEmail.trim()) {
      setErrorMsg('Enter your login ID or email.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Enter your password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(loginIdOrEmail.trim(), password);
      showToast('Authentication successful. Welcome to Dayflow!', 'success');
      onSuccess();
    } catch (err: any) {
      if (err.status === 401 || err.code === 'INVALID_CREDENTIALS') {
        setErrorMsg('Invalid login credentials.');
      } else if (err.status === 0 || err.code === 'NETWORK_ERROR') {
        setErrorMsg('Dayflow couldn\'t connect to the authentication service.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      }
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Enter a valid workforce email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await register(fullName.trim(), signupEmail.trim(), signupPassword);
      showToast('Account created successfully! Welcome to Dayflow.', 'success');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
      showToast(err.message || 'Account registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(3, 4, 3, 0.88)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(460px, 94vw)',
          background: '#0D120F',
          border: '1px solid rgba(124, 255, 178, 0.22)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          animation: 'loginFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Close Button */}
        <button
          aria-label="Close authentication modal"
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: '#131A15',
              border: '1px solid rgba(124, 255, 178, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(124, 255, 178, 0.2)',
            }}
          >
            <Sparkles size={24} color="#7CFFB2" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0, letterSpacing: '-0.02em' }}>
              {authMode === 'signin' ? 'Welcome back' : 'Create your account'}<span style={{ color: '#7CFFB2' }}>.</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.1em' }}>
              {authMode === 'signin' ? 'ENTER YOUR DAYFLOW WORKSPACE' : 'START YOUR DAYFLOW WORKSPACE'}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ background: 'rgba(233, 120, 112, 0.12)', border: '1px solid #E97870', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#E97870', fontSize: '0.8125rem', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {/* SIGN IN FORM */}
        {authMode === 'signin' ? (
          <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A918A', fontFamily: 'var(--font-mono)' }}>LOGIN ID OR WORKFORCE EMAIL</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} color="#8A918A" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="admin@dayflow.com or OIADMN20260001"
                  value={loginIdOrEmail}
                  onChange={(e) => setLoginIdOrEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 'var(--radius-md)',
                    background: '#131A15',
                    border: '1px solid rgba(243, 241, 232, 0.12)',
                    color: '#F3F1E8',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A918A', fontFamily: 'var(--font-mono)' }}>PASSWORD</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="#8A918A" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: 'var(--radius-md)',
                    background: '#131A15',
                    border: '1px solid rgba(243, 241, 232, 0.12)',
                    color: '#F3F1E8',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-full)',
                background: '#7CFFB2',
                color: '#060806',
                fontSize: '0.9375rem',
                fontWeight: 800,
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 0 30px rgba(124, 255, 178, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isSubmitting ? 'ENTERING DAYFLOW…' : 'ENTER DAYFLOW'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('signup');
                }}
                style={{ background: 'transparent', border: 'none', color: '#8A918A', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                New to Dayflow? <span style={{ color: '#7CFFB2' }}>CREATE ACCOUNT &rarr;</span>
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8A918A', fontFamily: 'var(--font-mono)' }}>FULL NAME</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={14} color="#8A918A" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-md)', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', fontSize: '0.8125rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8A918A', fontFamily: 'var(--font-mono)' }}>WORKFORCE EMAIL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={14} color="#8A918A" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="email"
                    placeholder="user@dayflow.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-md)', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', fontSize: '0.8125rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8A918A', fontFamily: 'var(--font-mono)' }}>PASSWORD</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showSignupPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', fontSize: '0.8125rem', outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8A918A', fontFamily: 'var(--font-mono)' }}>CONFIRM</label>
                    <button
                      type="button"
                      onClick={() => setShowSignupPass(!showSignupPass)}
                      style={{ background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer', padding: 0, fontSize: '0.6875rem' }}
                    >
                      {showSignupPass ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <input
                    type={showSignupPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', fontSize: '0.8125rem', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-full)',
                background: '#7CFFB2',
                color: '#060806',
                fontSize: '0.9375rem',
                fontWeight: 800,
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 0 30px rgba(124, 255, 178, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isSubmitting ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('signin');
                }}
                style={{ background: 'transparent', border: 'none', color: '#8A918A', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Already have an account? <span style={{ color: '#7CFFB2' }}>SIGN IN &rarr;</span>
              </button>
            </div>
          </form>
        )}

        <span style={{ fontSize: '0.75rem', color: '#59615A', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          DAYFLOW HRMS V3.0 &bull; SECURED WITH JWT & RBAC
        </span>
      </div>
      <style>{`
        @keyframes loginFadeUp {
          0% { transform: translateY(16px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
