import React, { useState } from 'react';
import { InsightCard } from '../common/InsightCard';
import { Badge } from '../common/Badge';
import { Sparkles, Shield, Cpu, RefreshCw, Activity, CheckCircle2 } from 'lucide-react';

export const IntelligenceSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'success'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const triggerReAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1400);
  };

  const INSIGHTS = [
    {
      id: '1',
      level: 'critical' as const,
      title: 'Sick Leave Spike Detected in Sales Team',
      description: '3 sales representatives requested sick leave for Friday August 22. Workforce capacity down by 25%.',
      category: 'Capacity Warning',
      actionText: 'View Leave Requests',
    },
    {
      id: '2',
      level: 'warning' as const,
      title: 'Consistent Late Check-ins Signal',
      description: '2 employees logged check-ins 25+ minutes past 9:00 AM shift start over the last 5 business days.',
      category: 'Attendance Signal',
      actionText: 'Inspect Attendance Logs',
    },
    {
      id: '3',
      level: 'success' as const,
      title: 'Engineering Goal Completion Rate High',
      description: 'Engineering team achieved 88% of Q3 performance goals 2 weeks ahead of scheduled deadline.',
      category: 'Performance Milestone',
      actionText: 'View Goal Review',
    },
  ];

  const filteredInsights = filter === 'all' ? INSIGHTS : INSIGHTS.filter((item) => item.level === filter);

  return (
    <section id="intelligence" style={{ padding: '6rem 0', background: 'rgba(99, 102, 241, 0.02)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="brand" icon={<Sparkles size={12} />}>Smart HR Analytics Engine</Badge>
          <h2 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3rem)', fontWeight: 800 }}>
            Contextual HR Intelligence.<br />
            <span className="aura-gradient-text">100% Deterministic & Private.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Dayflow evaluates workforce signals locally using rule-based algorithmic analytics. Get actionable alerts for attendance anomalies, overtime spikes, and leave balance warnings without external AI data leaks.
          </p>
        </div>

        {/* Signal Processing Engine Visual Bar */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-light)', color: 'var(--aura-cyan)' }}>
                <Activity size={18} />
              </div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>WORKFORCE SIGNAL ENGINE</span>
            </div>

            <button
              onClick={triggerReAnalysis}
              disabled={isAnalyzing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-primary)',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 700,
                border: 'none',
                cursor: isAnalyzing ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={14} style={{ animation: isAnalyzing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isAnalyzing ? 'Processing Engine Signals...' : 'Run Engine Signal Scan'}</span>
            </button>
          </div>

          {/* Signal Processor Pipeline Visualizer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="var(--color-success)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Attendance Patterns Logged</span>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="var(--color-success)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Overtime Thresholds Evaluated</span>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="var(--color-success)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Leave Balance Capacity Synced</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '8px' }}>Filter Signals:</span>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: filter === 'all' ? 'var(--brand-primary)' : 'var(--bg-elevated)',
              color: filter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            All Signals (3)
          </button>
          <button
            onClick={() => setFilter('critical')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: filter === 'critical' ? 'var(--color-error)' : 'var(--bg-elevated)',
              color: filter === 'critical' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter('warning')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: filter === 'warning' ? 'var(--color-warning)' : 'var(--bg-elevated)',
              color: filter === 'warning' ? '#FFFFFF' : 'var(--text-secondary)',
            }}
          >
            Warnings
          </button>
        </div>

        {/* Live Insight Cards Showcase Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              level={insight.level}
              title={insight.title}
              description={insight.description}
              category={insight.category}
              actionText={insight.actionText}
            />
          ))}
        </div>

        {/* Local Security Commitment Box */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            borderColor: 'rgba(99, 102, 241, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-light)', color: 'var(--aura-cyan)' }}>
              <Cpu size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Zero External AI API Dependencies</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                All analytics calculations run locally on PostgreSQL database aggregations inside your infrastructure.
              </p>
            </div>
          </div>
          <Badge variant="success" icon={<Shield size={12} />}>100% Data Privacy Guaranteed</Badge>
        </div>
      </div>
    </section>
  );
};
