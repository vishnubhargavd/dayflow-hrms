import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { useToast } from '../context/ToastContext';
import { CommandSearchModal } from '../components/common/CommandSearchModal';
import { Badge } from '../components/common/Badge';

import { DashboardView } from '../views/DashboardView';
import { EmployeesView } from '../views/EmployeesView';
import { AttendanceView } from '../views/AttendanceView';
import { LeaveView } from '../views/LeaveView';
import { PayrollView } from '../views/PayrollView';
import { PerformanceView } from '../views/PerformanceView';
import { HelpdeskView } from '../views/HelpdeskView';
import { NotificationsView } from '../views/NotificationsView';
import { SettingsView } from '../views/SettingsView';

import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  Target,
  LifeBuoy,
  Bell,
  Settings,
  Search,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
} from 'lucide-react';

interface AuthenticatedAppShellProps {
  onBackToLanding: () => void;
}

export const AuthenticatedAppShell: React.FC<AuthenticatedAppShellProps> = ({ onBackToLanding }) => {
  const { user, role, logout } = useAuth();
  const { isConnected, isChecking } = useHealth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCmdOpen, setIsCmdOpen] = useState<boolean>(false);

  const ALL_NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'employees', label: 'Workforce', icon: <Users size={18} />, roles: ['ADMIN', 'HR'] },
    { id: 'attendance', label: 'Attendance', icon: <Clock size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'leave', label: 'Leave & Time-Off', icon: <CalendarDays size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'payroll', label: 'Payroll', icon: <CreditCard size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'performance', label: 'Performance', icon: <Target size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'helpdesk', label: 'Helpdesk', icon: <LifeBuoy size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  ];

  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    showToast('Logged out of Dayflow HRMS', 'info');
    onBackToLanding();
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'employees':
        return <EmployeesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leave':
        return <LeaveView />;
      case 'payroll':
        return <PayrollView />;
      case 'performance':
        return <PerformanceView />;
      case 'helpdesk':
        return <HelpdeskView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  const userName = user?.employee
    ? `${user.employee.firstName} ${user.employee.lastName}`
    : user?.email || 'Workforce User';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#060806', color: '#F3F1E8' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: isSidebarCollapsed ? '72px' : '240px',
          background: '#0D120F',
          borderRight: '1px solid rgba(243, 241, 232, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 0.75rem',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 90,
        }}
        className="app-sidebar"
      >
        {/* Brand & Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', padding: '0 8px' }}>
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: '#131A15', border: '1px solid #7CFFB2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="#7CFFB2" />
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8' }}>
                  Dayflow<span style={{ color: '#7CFFB2' }}>.</span>
                </span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{ background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer', padding: '4px' }}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? '#131A15' : 'transparent',
                    color: isActive ? '#7CFFB2' : '#8A918A',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.875rem',
                    border: isActive ? '1px solid rgba(124, 255, 178, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ color: isActive ? '#7CFFB2' : '#8A918A' }}>{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer / Logout */}
        <div style={{ borderTop: '1px solid rgba(243, 241, 232, 0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!isSidebarCollapsed && (
            <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#F3F1E8' }}>{userName}</span>
              <span style={{ fontSize: '0.6875rem', color: '#8A918A', fontFamily: 'var(--font-mono)' }}>{user?.loginId || user?.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              border: 'none',
              color: '#E97870',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
            }}
          >
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            borderBottom: '1px solid rgba(243, 241, 232, 0.08)',
            background: 'rgba(13, 18, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 80,
          }}
        >
          {/* Left: Command Search Button Trigger */}
          <button
            onClick={() => setIsCmdOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: '#0D120F',
              border: '1px solid rgba(243, 241, 232, 0.12)',
              borderRadius: 'var(--radius-full)',
              color: '#8A918A',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <Search size={14} color="#7CFFB2" />
            <span>Search Dayflow (Ctrl + K)</span>
          </button>

          {/* Right Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Badge variant="brand" icon={<Shield size={12} />}>
              ROLE: {role}
            </Badge>

            <Badge variant={isConnected ? 'success' : isChecking ? 'warning' : 'error'} icon={<Activity size={12} />}>
              {isConnected ? 'CONNECTED' : isChecking ? 'CONNECTING...' : 'OFFLINE'}
            </Badge>

            <button
              onClick={onBackToLanding}
              style={{
                background: 'transparent',
                border: '1px solid rgba(243, 241, 232, 0.12)',
                color: '#F3F1E8',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Landing View
            </button>
          </div>
        </header>

        {/* Main View Render Workspace */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandSearchModal
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onSelectRoute={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};
