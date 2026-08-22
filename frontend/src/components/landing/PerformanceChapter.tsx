import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Target, Award } from 'lucide-react';

export const PerformanceChapter: React.FC = () => {
  const [goalScore, setGoalScore] = useState<number>(82);

  const calculateReviewRating = (score: number) => {
    return (3.0 + (score / 100) * 2.0).toFixed(1);
  };

  return (
    <section id="performance" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* Chapter Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <span className="chapter-num" style={{ color: '#7CFFB2' }}>04 / 06 &bull; PERFORMANCE</span>
          <h2 className="editorial-heading">
            <span style={{ color: '#F3F1E8' }}>PROGRESS SHOULD BE</span><br />
            <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VISIBLE.
            </span>
          </h2>
        </div>

        {/* Two-Column Composition */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Column: Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <p style={{ color: '#A8ADA4', fontSize: '1.125rem', lineHeight: 1.65 }}>
              Track OKRs, continuous feedback loops, performance appraisal ratings, and skill development competencies in real-time.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#0D120F', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 241, 232, 0.08)' }}>
                <Target size={20} color="#7CFFB2" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.8125rem', color: '#8A918A', display: 'block' }}>OKR Target Completion</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>{goalScore}%</span>
              </div>
              <div style={{ background: '#0D120F', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 241, 232, 0.08)' }}>
                <Award size={20} color="#D6C38A" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.8125rem', color: '#8A918A', display: 'block' }}>Calculated Review Rating</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D6C38A' }}>{calculateReviewRating(goalScore)} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Progress Ring Simulator */}
          <div className="product-surface" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center', background: 'rgba(13, 18, 15, 0.88)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>PERFORMANCE WORKFLOW DEMO</span>
              <Badge variant="brand">MINT PROGRESS RING</Badge>
            </div>

            {/* SVG Radial Goal Ring */}
            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="75" fill="none" stroke="#087A52" strokeWidth="12" />
                <circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke="#7CFFB2"
                  strokeWidth="12"
                  strokeDasharray="471"
                  strokeDashoffset={471 - (471 * goalScore) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>{goalScore}%</span>
                <span style={{ fontSize: '0.6875rem', color: '#7CFFB2', fontWeight: 700 }}>ON TARGET</span>
              </div>
            </div>

            {/* Score Slider */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8A918A' }}>
                <span>0% Progress</span>
                <span>Adjust Goal Completion</span>
                <span>100% Progress</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={goalScore}
                onChange={(e) => setGoalScore(Number(e.target.value))}
                style={{ accentColor: '#7CFFB2', cursor: 'pointer', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
