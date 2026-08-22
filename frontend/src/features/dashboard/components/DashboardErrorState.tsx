import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ background: '#0D120F', border: '1px solid rgba(233, 120, 112, 0.22)', borderRadius: 'var(--radius-lg)', padding: '3.5rem', textAlign: 'center' }}>
        <AlertTriangle size={40} color="#E97870" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: '#F3F1E8', fontWeight: 800, margin: 0 }}>DASHBOARD CONNECTION INTERRUPTED</h3>
        <p style={{ fontSize: '0.875rem', color: '#A8ADA4', marginTop: '8px', maxWidth: '480px', margin: '8px auto 1.5rem auto' }}>{error}</p>
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            background: '#131A15',
            border: '1px solid rgba(124, 255, 178, 0.3)',
            color: '#7CFFB2',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    </div>
  );
};
