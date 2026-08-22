import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, LayoutDashboard, Users, Clock, CalendarDays, CreditCard, Target, LifeBuoy, Bell, Settings, X } from 'lucide-react';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (tab: string) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({ isOpen, onClose, onSelectRoute }) => {
  const { user } = useAuth();
  const role = user?.role || 'HR';
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ALL_COMMANDS = [
    { id: 'dashboard', label: 'Go to Dashboard', cat: 'Navigation', icon: <LayoutDashboard size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'employees', label: 'Go to Employee Directory', cat: 'Workforce', icon: <Users size={16} />, roles: ['ADMIN', 'HR'] },
    { id: 'attendance', label: 'Go to Attendance & Hours', cat: 'Operations', icon: <Clock size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'leave', label: 'Go to Leave & Applications', cat: 'Operations', icon: <CalendarDays size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'payroll', label: 'Go to Payroll & Payslips', cat: 'Finance', icon: <CreditCard size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'performance', label: 'Go to Performance Goals', cat: 'Growth', icon: <Target size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'helpdesk', label: 'Go to Helpdesk Workspace', cat: 'Support', icon: <LifeBuoy size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'notifications', label: 'Go to Notification Center', cat: 'Signals', icon: <Bell size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'settings', label: 'Go to Account Settings', cat: 'System', icon: <Settings size={16} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  ];

  const COMMANDS = ALL_COMMANDS.filter((cmd) => cmd.roles.includes(role));

  const filtered = COMMANDS.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(6, 8, 6, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(640px, 92vw)',
          background: '#0D120F',
          border: '1px solid rgba(124, 255, 178, 0.25)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          animation: 'cmdScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Search Header Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(243, 241, 232, 0.08)', gap: '12px' }}>
          <Search size={20} color="#7CFFB2" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search module (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#F3F1E8',
              fontSize: '1rem',
              outline: 'none',
              fontWeight: 600,
            }}
          />
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Command Results */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px 12px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#8A918A', fontSize: '0.875rem' }}>No matching commands found for your role</div>
          ) : (
            filtered.map((cmd) => (
              <div
                key={cmd.id}
                onClick={() => {
                  onSelectRoute(cmd.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  color: '#F3F1E8',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#131A15')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#7CFFB2' }}>{cmd.icon}</span>
                  <span>{cmd.label}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#8A918A', fontFamily: 'var(--font-mono)' }}>{cmd.cat}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        @keyframes cmdScaleIn {
          0% { transform: scale(0.96); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
