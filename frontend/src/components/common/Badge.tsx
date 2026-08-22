import React, { type ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, icon }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'rgba(16, 185, 129, 0.25)' };
      case 'warning':
        return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.25)' };
      case 'error':
        return { bg: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'rgba(239, 68, 68, 0.25)' };
      case 'info':
        return { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: 'rgba(59, 130, 246, 0.25)' };
      case 'brand':
        return { bg: 'var(--brand-primary-light)', color: 'var(--brand-primary)', border: 'rgba(99, 102, 241, 0.3)' };
      default:
        return { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'var(--border-subtle)' };
    }
  };

  const { bg, color, border } = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        letterSpacing: '0.02em',
      }}
    >
      {icon && <span style={{ display: 'flex', fontSize: '12px' }}>{icon}</span>}
      {children}
    </span>
  );
};
