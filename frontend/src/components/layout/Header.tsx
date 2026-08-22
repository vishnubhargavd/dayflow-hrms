import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { useVisualEngine } from '../../hooks/useVisualEngine';
import { Badge } from '../common/Badge';
import { Activity, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenNav?: () => void;
  onNavigateToApp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToApp }) => {
  const { isConnected, isChecking } = useHealth();
  const { scrollProgress } = useVisualEngine();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isScrolled = scrollProgress > 2;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(6, 8, 6, 0.78)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(22px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(22px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(243, 241, 232, 0.07)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 20px 60px rgba(0, 0, 0, 0.40)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* 1px Mint Scroll Progress Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '1.5px',
          width: `${scrollProgress}%`,
          background: '#7CFFB2',
          transition: 'width 0.1s ease-out',
        }}
      />

      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: isScrolled ? '64px' : '76px',
          transition: 'height 0.3s ease',
        }}
      >
        {/* Left: Logo (Pearl + Electric Mint Sparkle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: '#131A15',
              border: '1px solid rgba(124, 255, 178, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(124, 255, 178, 0.15)',
            }}
          >
            <Sparkles size={18} color="#7CFFB2" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#F3F1E8' }}>
              Dayflow<span style={{ color: '#7CFFB2' }}>.</span>
            </span>
            <span style={{ fontSize: '0.625rem', color: '#8A918A', fontWeight: 700, letterSpacing: '0.05em', marginTop: '-4px' }}>
              AURA OPERATING SYSTEM
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Real Backend Connection Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge
              variant={isConnected ? 'success' : isChecking ? 'warning' : 'error'}
              icon={<Activity size={12} />}
            >
              {isConnected ? '● CONNECTED TO DAYFLOW' : isChecking ? '● CONNECTING...' : '● SYSTEM OFFLINE'}
            </Badge>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onNavigateToApp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: 'var(--radius-full)',
              background: '#7CFFB2',
              color: '#060806',
              fontSize: '0.8125rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(124, 255, 178, 0.22)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>ENTER DAYFLOW</span>
            <ArrowRight size={16} />
          </button>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#F3F1E8',
              cursor: 'pointer',
              padding: '4px',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
