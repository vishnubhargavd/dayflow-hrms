import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ArrowRight, Sparkles, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section
      className="bg-grid-aura"
      style={{
        padding: '7rem 0 5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="container"
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Eyebrow Status Badge Pill */}
        <Badge variant="brand" icon={<Sparkles size={12} />}>
          ● DAYFLOW AURA &bull; INTELLIGENT WORKFORCE OPERATING SYSTEM
        </Badge>

        {/* Luminous Clamp Headline */}
        <h1
          style={{
            fontSize: 'clamp(3.25rem, 6.5vw, 6.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: '980px',
            margin: '0 auto',
            letterSpacing: '-0.04em',
          }}
        >
          Everything your people need.<br />
          <span className="aura-gradient-text">One intelligent HR workspace.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1.125rem, 2.2vw, 1.35rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Streamline attendance, automated payroll processing, time-off approvals, employee goals, and HR request management in a unified enterprise environment.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Button
            size="lg"
            className="light-sweep-btn"
            icon={<ArrowRight size={18} />}
            onClick={onExplore}
          >
            Explore Live Product Experience
          </Button>
          <Button
            size="lg"
            variant="secondary"
            icon={<ShieldCheck size={18} />}
            onClick={() => window.open('http://localhost:5000/api/v1/health', '_blank')}
          >
            API Status & Diagnostics
          </Button>
        </div>

        {/* Contextual Floating Data Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}
        >
          <div
            className="glass-card"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              background: 'rgba(11, 17, 32, 0.8)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span className="live-pulse-dot" />
            <span style={{ color: 'var(--text-primary)' }}>94.8% Attendance</span>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              background: 'rgba(11, 17, 32, 0.8)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <TrendingUp size={14} color="var(--color-success)" />
            <span style={{ color: 'var(--text-primary)' }}>+12.4% Workforce Health</span>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              background: 'rgba(11, 17, 32, 0.8)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Zap size={14} color="var(--aura-cyan)" />
            <span style={{ color: 'var(--text-primary)' }}>3 Insights Emitted</span>
          </div>
        </div>
      </div>
    </section>
  );
};
