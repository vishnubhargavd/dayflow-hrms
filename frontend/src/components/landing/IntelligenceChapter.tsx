import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Sparkles, Brain, Cpu, CheckCircle } from 'lucide-react';

export const IntelligenceChapter: React.FC = () => {
  const [scanStageIndex, setScanStageIndex] = useState<number>(3);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const SCAN_STEPS = [
    '01 COLLECTING LOGS',
    '02 ANALYZING PATTERNS',
    '03 IDENTIFYING ANOMALIES',
    '04 ACTION READY',
  ];

  const SIGNALS = [
    { title: 'LOW ATTENDANCE WARNING', desc: 'Operations cluster attendance dipped below 92.5% threshold', type: 'CRITICAL', color: '#E97870' },
    { title: 'OVERTIME SPIKE DETECTED', desc: 'Engineering team logged +18.4% overtime in last 7 days', type: 'WARNING', color: '#E7B95E' },
    { title: 'LEAVE CONCENTRATION', desc: '3 senior leads on leave simultaneously in week 22', type: 'IMPORTANT', color: '#D6C38A' },
  ];

  const runSignalScan = () => {
    setIsScanning(true);
    setScanStageIndex(0);

    const interval = setInterval(() => {
      setScanStageIndex((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsScanning(false);
          return 3;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <section id="intelligence" style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* Chapter Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <span className="chapter-num" style={{ color: '#7CFFB2' }}>05 / 06 &bull; INTELLIGENCE</span>
          <h2 className="editorial-heading">
            <span style={{ color: '#F3F1E8' }}>SEE WHAT</span><br />
            <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              OTHERS MISS.
            </span>
          </h2>
        </div>

        {/* Two-Column Composition */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Column: Description & Feature Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <p style={{ color: '#A8ADA4', fontSize: '1.125rem', lineHeight: 1.65 }}>
              Proactively detect attendance anomalies, flight risk patterns, payroll variances, and manager workload bottlenecks before they affect output.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Brain size={18} color="#7CFFB2" />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F3F1E8' }}>Automated Anomaly Detection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={18} color="#D6C38A" />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#F3F1E8' }}>Real-time Workforce Signal Processing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signal Engine Scanner */}
          <div className="product-surface" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(13, 18, 15, 0.88)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#7CFFB2" />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>CONCEPTUAL SIGNAL PROCESSOR</span>
              </div>
              <Badge variant="brand">MINT AI CORE</Badge>
            </div>

            {/* Scan Simulation Stage Bar */}
            <div style={{ background: '#0D120F', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 241, 232, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#8A918A' }}>PROCESSOR STAGE:</span>
              <span style={{ color: isScanning ? '#D6C38A' : '#7CFFB2', fontWeight: 800 }}>
                {SCAN_STEPS[scanStageIndex]}
              </span>
            </div>

            {/* Detected Signals List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SIGNALS.map((sig) => (
                <div
                  key={sig.title}
                  style={{
                    background: '#0D120F',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${sig.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: sig.color, fontFamily: 'var(--font-mono)' }}>{sig.title}</span>
                    <Badge variant={sig.type === 'CRITICAL' ? 'error' : 'warning'}>{sig.type}</Badge>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#A8ADA4' }}>{sig.desc}</p>
                </div>
              ))}
            </div>

            {/* Scan Action Button */}
            <button
              onClick={runSignalScan}
              disabled={isScanning}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: isScanning ? '#131A15' : '#7CFFB2',
                color: isScanning ? '#8A918A' : '#060806',
                fontSize: '0.875rem',
                fontWeight: 800,
                border: 'none',
                cursor: isScanning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {isScanning ? (
                <>Simulating Signal Processor...</>
              ) : (
                <>
                  <CheckCircle size={16} /> Run Signal Analysis Demonstration
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
