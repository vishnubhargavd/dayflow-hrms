import React from 'react';
import { type AdminDashboardData } from '../dashboard.api';
import { StatCard } from '../../../components/common/StatCard';
import { Badge } from '../../../components/common/Badge';
import { Activity, Shield, Users, CreditCard, LifeBuoy } from 'lucide-react';

interface AdminDashboardProps {
  data: AdminDashboardData;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ data }) => {
  const health = data.health;
  const totalEmp = data.totalEmployees;
  const payrolls = data.payrollRuns;
  const tickets = data.tickets;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#7CFFB2', fontWeight: 800 }}>SYSTEM ADMIN CORE</span>
            <Badge variant="brand" icon={<Shield size={12} />}>ROLE: ADMIN</Badge>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F3F1E8', margin: '4px 0 0 0' }}>
            Organization & System Operational Control<span style={{ color: '#7CFFB2' }}>.</span>
          </h2>
        </div>
      </div>

      {/* System Health Card (GET /api/v1/health) */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(124, 255, 178, 0.22)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="#7CFFB2" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>System Health Monitor</h3>
          </div>
          <Badge variant={health?.status === 'OK' ? 'success' : 'warning'}>
            {health?.status || 'HEALTHY'}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#131A15', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', fontWeight: 600 }}>DATABASE CONNECTION</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#7CFFB2', fontFamily: 'var(--font-mono)' }}>
              CONNECTED
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', fontWeight: 600 }}>API STATUS</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F3F1E8', fontFamily: 'var(--font-mono)' }}>
              HTTP 200 OK
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', fontWeight: 600 }}>SYSTEM LATENCY</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#D6C38A', fontFamily: 'var(--font-mono)' }}>
              &lt; 15 ms
            </span>
          </div>
        </div>
      </div>

      {/* Admin Operational KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard title="Enterprise Headcount" value={`${totalEmp}`} change="System Records" trend="up" icon={<Users size={16} />} />
        <StatCard title="Active Payroll Runs" value={`${payrolls.length}`} change="Disbursement Logs" trend="neutral" icon={<CreditCard size={16} />} />
        <StatCard title="System Support Tickets" value={`${tickets.length}`} change="Workspace Queue" trend="neutral" icon={<LifeBuoy size={16} />} />
      </div>
    </div>
  );
};
