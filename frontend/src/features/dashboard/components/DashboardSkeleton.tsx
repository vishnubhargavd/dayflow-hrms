import React from 'react';

interface DashboardSkeletonProps {
  role: string;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ role }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #7CFFB2', borderTopColor: 'transparent', margin: '0 auto 1rem auto', animation: 'spin 1s linear infinite' }} />
        <h4 style={{ color: '#F3F1E8', fontWeight: 800, margin: 0 }}>LOADING DAYFLOW WORKSPACE...</h4>
        <p style={{ fontSize: '0.8125rem', color: '#8A918A', marginTop: '6px' }}>Fetching real-time backend organizational metrics for role: {role}</p>
      </div>
    </div>
  );
};
