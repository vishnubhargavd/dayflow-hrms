import React, { useState, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate magnetic pull delta (max 4px displacement)
    const deltaX = (e.clientX - centerX) * 0.12;
    const deltaY = (e.clientY - centerY) * 0.12;
    setOffset({
      x: Math.max(-4, Math.min(4, deltaX)),
      y: Math.max(-4, Math.min(4, deltaY)),
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--brand-primary)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
        };
      case 'secondary':
        return {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--brand-primary)',
          border: '1px solid var(--brand-primary)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
        };
      case 'danger':
        return {
          background: 'var(--color-error)',
          color: '#FFFFFF',
          border: 'none',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '1rem', borderRadius: 'var(--radius-md)' };
      default:
        return { padding: '10px 20px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
        ...variantStyle,
        ...sizeStyle,
      }}
      className={`dayflow-btn ${className}`}
      {...props}
    >
      {isLoading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      )}
      {!isLoading && icon && <span style={{ display: 'flex' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
