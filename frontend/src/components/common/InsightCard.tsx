import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Zap } from 'lucide-react';
import { Badge } from './Badge';

export type InsightLevel = 'info' | 'warning' | 'critical' | 'success';

interface InsightCardProps {
  level: InsightLevel;
  title: string;
  description: string;
  category: string;
  actionText?: string;
  onAction?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  level,
  title,
  description,
  category,
  actionText,
  onAction,
}) => {
  const getBadgeVariant = () => {
    switch (level) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'critical':
        return <AlertTriangle size={18} color="var(--color-error)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--color-warning)" />;
      case 'success':
        return <CheckCircle2 size={18} color="var(--color-success)" />;
      default:
        return <Info size={18} color="var(--color-info)" />;
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        borderLeft: `4px solid ${
          level === 'critical'
            ? 'var(--color-error)'
            : level === 'warning'
            ? 'var(--color-warning)'
            : level === 'success'
            ? 'var(--color-success)'
            : 'var(--color-info)'
        }`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getIcon()}
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </span>
        </div>
        <Badge variant={getBadgeVariant()} icon={<Zap size={10} />}>
          {category}
        </Badge>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
        {description}
      </p>

      {actionText && (
        <div style={{ marginTop: '0.25rem' }}>
          <button
            onClick={onAction}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--brand-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            {actionText} &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
