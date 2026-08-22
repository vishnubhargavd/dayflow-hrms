import React, { useState } from 'react';
import { useSceneProgress } from '../../hooks/useSceneProgress';
import { Users, Clock, CalendarDays, CreditCard, Target, Sparkles, Zap } from 'lucide-react';

export const CinematicSystemScene: React.FC = () => {
  const { activeChapter } = useSceneProgress();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const NODES = [
    { id: 'workforce', label: 'WORKFORCE', icon: <Users size={16} />, val: '1,248' },
    { id: 'attendance', label: 'ATTENDANCE', icon: <Clock size={16} />, val: '94.8%' },
    { id: 'leave', label: 'LEAVE', icon: <CalendarDays size={16} />, val: '4 Pending' },
    { id: 'payroll', label: 'PAYROLL', icon: <CreditCard size={16} />, val: '$142.5k' },
    { id: 'performance', label: 'PERFORMANCE', icon: <Target size={16} />, val: '88% OKR' },
    { id: 'intelligence', label: 'INTELLIGENCE', icon: <Sparkles size={16} />, val: '3 Signals' },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'sticky',
        top: '80px',
        zIndex: 5,
        margin: '0 auto 3rem auto',
        maxWidth: '1200px',
        padding: '0 1.5rem',
      }}
    >
      {/* Master Spatial Transformation Container Bar */}
      <div
        className="product-surface"
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderColor: 'rgba(99, 102, 241, 0.4)',
          background: 'rgba(11, 17, 32, 0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary)', color: '#FFFFFF' }}>
            <Zap size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              SYSTEM ARCHITECTURE STATE
            </span>
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, display: 'block', color: 'var(--aura-cyan)' }}>
              ACTIVE SCENE &bull; {activeChapter.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Connected Node Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {NODES.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isHovered ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                  border: isHovered ? '1px solid var(--aura-cyan)' : '1px solid var(--border-subtle)',
                  color: isHovered ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}
              >
                {node.icon}
                <span>{node.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.8, fontSize: '0.6875rem' }}>({node.val})</span>
              </div>
            );
          })}
        </div>

        {/* Data Packet Travel Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="live-pulse-dot" />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            DATA PACKETS TRAVELING
          </span>
        </div>
      </div>
    </div>
  );
};
