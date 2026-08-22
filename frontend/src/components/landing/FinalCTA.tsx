import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onExplore: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onExplore }) => {
  return (
    <section style={{ padding: '6rem 0' }}>
      <div className="container">
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          }}
        >
          <Badge variant="brand" icon={<Sparkles size={12} />}>Ready for High Performance</Badge>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, maxWidth: '700px', lineHeight: 1.2 }}>
            Give your people a better way to work.
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', fontSize: '1.0625rem', lineHeight: 1.6 }}>
            Experience Dayflow's intelligent HR operating system. Connect attendance, payroll, leave, and performance in one workspace.
          </p>
          <Button size="lg" icon={<ArrowRight size={18} />} onClick={onExplore}>
            Launch Dayflow Preview Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
};
