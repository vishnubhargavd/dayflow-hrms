import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/auth.api';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Shield, Key, Lock, Eye, EyeOff } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);
  const [passError, setPassError] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPassError('Enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);
    setPassError(null);

    try {
      await changePassword(currentPassword, newPassword);
      showToast('Password updated successfully. Please sign in again.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        logout();
      }, 1200);
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password. Please check your current password.');
      showToast(err.message || 'Password update failed', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  const userName = user?.employee
    ? `${user.employee.firstName} ${user.employee.lastName}`
    : user?.email || 'Workforce User';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>System Settings & Security</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Manage profile credentials, role permissions, and password security.</p>
        </div>
        <Badge variant="brand" icon={<Shield size={12} />}>ROLE: {role}</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Profile Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>NAME</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F3F1E8' }}>{userName}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>LOGIN ID / EMAIL</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#7CFFB2', fontFamily: 'var(--font-mono)' }}>{user?.loginId} &bull; {user?.email}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>DEPARTMENT & DESIGNATION</span>
              <span style={{ fontSize: '0.875rem', color: '#F3F1E8' }}>
                {user?.employee?.designation?.title || 'Standard Staff'} ({user?.employee?.department?.name || 'General'})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>AUTHENTICATED ROLE</span>
              <span style={{ fontSize: '0.875rem', color: '#D6C38A', fontWeight: 700 }}>{role}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color="#7CFFB2" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Security & Password</h3>
          </div>

          {passError && (
            <div style={{ background: 'rgba(233, 120, 112, 0.12)', border: '1px solid #E97870', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#E97870', fontSize: '0.8125rem', fontWeight: 600 }}>
              {passError}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>CURRENT PASSWORD</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="#8A918A" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ width: '100%', padding: '10px 42px 10px 42px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                />
                <button
                  type="button"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: '14px', background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer' }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>NEW PASSWORD</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="#8A918A" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{ width: '100%', padding: '10px 42px 10px 42px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                />
                <button
                  type="button"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '14px', background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>CONFIRM NEW PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                style={{ padding: '10px 14px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              style={{
                marginTop: '0.5rem',
                padding: '12px 20px',
                borderRadius: 'var(--radius-full)',
                background: '#7CFFB2',
                color: '#060806',
                fontWeight: 800,
                fontSize: '0.875rem',
                border: 'none',
                cursor: isChangingPass ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{isChangingPass ? 'UPDATING PASSWORD…' : 'UPDATE PASSWORD'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
