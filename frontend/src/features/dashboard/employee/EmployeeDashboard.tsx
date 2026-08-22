import React from 'react';
import { type EmployeeDashboardData } from '../dashboard.api';
import { Badge } from '../../../components/common/Badge';
import {
  Clock,
  CalendarDays,
  CreditCard,
  Target,
  LifeBuoy,
  Shield,
  Activity,
  Bell,
} from 'lucide-react';

interface EmployeeDashboardProps {
  data: EmployeeDashboardData;
  userName: string;
  isConnected: boolean;
  isChecking: boolean;
  onNavigateTab: (tabId: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  data,
  userName,
  isConnected,
  isChecking,
  onNavigateTab,
}) => {
  const todayAtt = data.todayAttendance;
  const leaveBalances = data.leaveBalances;
  const goals = data.performanceGoals;
  const tickets = data.tickets;
  const notifs = data.notifications;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Workspace Hero Greeting */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#7CFFB2', fontWeight: 800 }}>MY WORKSPACE</span>
            <Badge variant="brand" icon={<Shield size={12} />}>EMPLOYEE</Badge>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F3F1E8', margin: 0, letterSpacing: '-0.02em' }}>
            GOOD DAY, {userName}<span style={{ color: '#7CFFB2' }}>.</span>
          </h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: 0 }}>Your personal workforce operating portal is ready.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant={isConnected ? 'success' : isChecking ? 'warning' : 'error'} icon={<Activity size={12} />}>
            {isConnected ? 'CONNECTED' : isChecking ? 'CONNECTING...' : 'OFFLINE'}
          </Badge>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <button
          onClick={() => onNavigateTab('attendance')}
          style={{ padding: '1rem', background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-md)', color: '#F3F1E8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}
        >
          <Clock size={20} color="#7CFFB2" />
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block' }}>Check Attendance</span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>Log shift hours</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('leave')}
          style={{ padding: '1rem', background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-md)', color: '#F3F1E8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}
        >
          <CalendarDays size={20} color="#D6C38A" />
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block' }}>Apply Leave</span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>Time-off request</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('payroll')}
          style={{ padding: '1rem', background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-md)', color: '#F3F1E8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}
        >
          <CreditCard size={20} color="#159A68" />
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block' }}>View Payslips</span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>Salary details</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('helpdesk')}
          style={{ padding: '1rem', background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-md)', color: '#F3F1E8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}
        >
          <LifeBuoy size={20} color="#7CFFB2" />
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, display: 'block' }}>Raise Support Ticket</span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>IT & HR help</span>
          </div>
        </button>
      </div>

      {/* Core Personal KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {/* Today Attendance Status */}
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#7CFFB2" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F3F1E8' }}>TODAY'S ATTENDANCE</span>
            </div>
            <Badge variant={todayAtt?.status === 'PRESENT' ? 'success' : 'warning'}>{todayAtt?.status || 'NOT CHECKED IN'}</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>
              {todayAtt?.checkIn ? todayAtt.checkIn : '--:--'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>
              {todayAtt?.checkOut ? `Checked Out: ${todayAtt.checkOut}` : 'Web check-in active'}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('attendance')}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#7CFFB2', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            Open Attendance Record &rarr;
          </button>
        </div>

        {/* Leave Balance Overview */}
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} color="#D6C38A" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F3F1E8' }}>LEAVE BALANCES</span>
            </div>
            <Badge variant="warning">{leaveBalances.length} ALLOCATED</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>
              {leaveBalances.length > 0 ? `${leaveBalances[0].remainingDays} Days` : '0 Days'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>
              {leaveBalances.length > 0 ? `${leaveBalances[0].leaveType.name} Remaining` : 'No balances allocated yet'}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('leave')}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#D6C38A', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            Apply For Leave &rarr;
          </button>
        </div>

        {/* OKRs & Goals */}
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="#7CFFB2" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F3F1E8' }}>ACTIVE GOALS</span>
            </div>
            <Badge variant="brand">{goals.length} ASSIGNED</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>
              {goals.length > 0 ? `${goals[0].progressPercentage}%` : 'NO GOALS'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#8A918A' }}>
              {goals.length > 0 ? goals[0].title : 'Assigned objectives will appear here'}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('performance')}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#7CFFB2', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            View Performance OKRs &rarr;
          </button>
        </div>
      </div>

      {/* Support & Signals Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LifeBuoy size={18} color="#7CFFB2" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F3F1E8' }}>HELPDESK TICKETS</span>
            </div>
            <Badge variant="info">{tickets.length} OPEN</Badge>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#8A918A', margin: 0 }}>
            {tickets.length > 0 ? `Latest Ticket: ${tickets[0].subject}` : 'No open support requests.'}
          </p>
          <button
            onClick={() => onNavigateTab('helpdesk')}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#7CFFB2', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            Open Support Workspace &rarr;
          </button>
        </div>

        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#7CFFB2" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#F3F1E8' }}>SYSTEM NOTIFICATIONS</span>
            </div>
            <Badge variant="brand">{notifs.length} SIGNALS</Badge>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#8A918A', margin: 0 }}>
            {notifs.length > 0 ? notifs[0].title : 'You are all caught up.'}
          </p>
          <button
            onClick={() => onNavigateTab('notifications')}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#7CFFB2', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            View Notification Signals &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
