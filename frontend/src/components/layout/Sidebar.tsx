import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { type UserRole } from '../../api/auth.api';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Target,
  LifeBuoy,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: string;
}

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { role, user } = useAuth();

  const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'employees', label: 'Employee Directory', icon: <Users size={18} />, roles: ['ADMIN', 'HR'] },
    { id: 'attendance', label: 'Attendance & Hours', icon: <Clock size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'leave', label: 'Leave & Time-Off', icon: <CalendarDays size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'payroll', label: 'Payroll & Payslips', icon: <CreditCard size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'performance', label: 'Performance & Goals', icon: <Target size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'helpdesk', label: 'HR Helpdesk', icon: <LifeBuoy size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'], badge: '3' },
    { id: 'insights', label: 'Smart HR Insights', icon: <Sparkles size={18} />, roles: ['ADMIN', 'HR'], badge: 'AI' },
    { id: 'audit', label: 'Security & Audit Logs', icon: <ShieldCheck size={18} />, roles: ['ADMIN'] },
  ];

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const firstName = user?.employee?.firstName || user?.email || 'User';
  const lastName = user?.employee?.lastName || '';

  return (
    <aside
      style={{
        width: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 72px)',
        position: 'sticky',
        top: '72px',
        padding: '1.25rem 0.75rem',
      }}
    >
      {/* Active User Identity Info */}
      <div
        style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--brand-gradient)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.875rem',
          }}
        >
          {firstName.charAt(0)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {firstName} {lastName}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
            {role === 'ADMIN' ? 'System Administrator' : role === 'HR' ? 'HR Manager' : 'Employee'}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', padding: '0 0.5rem 0.5rem 0.5rem' }}>
          NAVIGATION MODULES
        </span>
        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                transition: 'all 0.15s ease-in-out',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge ? (
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight size={14} />
              ) : null}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
