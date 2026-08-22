import React, { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  subtext,
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'var(--color-success)';
    if (trend === 'down') return 'var(--color-error)';
    return 'var(--text-muted)';
  };

  const renderTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} />;
    if (trend === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {value}
        </span>
        {change && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: getTrendColor(),
            }}
          >
            {renderTrendIcon()}
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};
