import React from 'react';
import { type HrDashboardData } from '../dashboard.api';
import { StatCard } from '../../../components/common/StatCard';
import { Badge } from '../../../components/common/Badge';
import { Users, Clock, CreditCard, LifeBuoy, Shield, Plus, ArrowRight } from 'lucide-react';

interface HrDashboardProps {
  data: HrDashboardData;
  onNavigateTab: (tabId: string) => void;
}

export const HrDashboard: React.FC<HrDashboardProps> = ({ data, onNavigateTab }) => {
  const attOverview = data.attendanceOverview;
  const totalEmp = data.totalEmployees;
  const payrolls = data.payrollRuns;
  const tickets = data.tickets;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#7CFFB2', fontWeight: 800 }}>HR OPERATIONAL CORE</span>
            <Badge variant="brand" icon={<Shield size={12} />}>ROLE: HR</Badge>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F3F1E8', margin: '4px 0 0 0' }}>
            Workforce Operations Command Center<span style={{ color: '#7CFFB2' }}>.</span>
          </h2>
        </div>
        <button
          onClick={() => onNavigateTab('employees')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-md)', background: '#7CFFB2', color: '#060806', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={16} /> Manage Workforce
        </button>
      </div>

      {/* HR KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard title="Total Headcount" value={`${totalEmp}`} change="Active Workforce" trend="up" icon={<Users size={16} />} />
        <StatCard title="Attendance Rate" value={attOverview ? `${attOverview.attendancePercentage.toFixed(1)}%` : 'SYSTEM READY'} change="Organization Today" trend="up" icon={<Clock size={16} />} />
        <StatCard title="Payroll Runs" value={`${payrolls.length}`} change="Active Payrolls" trend="neutral" icon={<CreditCard size={16} />} />
        <StatCard title="Support Tickets" value={`${tickets.length}`} change="HR Helpdesk Queue" trend="neutral" icon={<LifeBuoy size={16} />} />
      </div>

      {/* Workforce Overview & Navigation CTA */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Workforce Directory & Designation Control</h4>
          <p style={{ color: '#8A918A', fontSize: '0.8125rem', margin: '4px 0 0 0' }}>Manage employee profiles, departments, joining records, and status credentials.</p>
        </div>
        <button
          onClick={() => onNavigateTab('employees')}
          style={{ background: '#131A15', border: '1px solid rgba(124, 255, 178, 0.3)', color: '#7CFFB2', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>VIEW WORKFORCE DIRECTORY</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
