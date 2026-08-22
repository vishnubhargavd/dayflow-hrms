import React, { useState, useEffect } from 'react';
import { fetchPerformanceGoals, type PerformanceGoal } from '../api/performance.api';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Target, Award, TrendingUp } from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadGoals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPerformanceGoals();
        if (isMounted) setGoals(data);
      } catch {
        // Handled
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadGoals();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Performance & OKRs</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Align team objectives, track milestone completion, and conduct quarterly performance reviews.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard title="OKR Engine Status" value="ACTIVE" change="Quarterly Cycle" trend="up" icon={<Target size={16} />} />
        <StatCard title="Review Milestone" value="Q3 2026" change="On Track" trend="neutral" icon={<Award size={16} />} />
        <StatCard title="Active Goals" value={`${goals.length}`} change="Assigned Objectives" trend="up" icon={<TrendingUp size={16} />} />
      </div>

      {/* Goals List */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', marginBottom: '1rem' }}>Active Performance Objectives</h3>

        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#8A918A' }}>Loading performance goals...</div>
        ) : goals.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8A918A' }}>
            <Target size={32} color="#7CFFB2" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ color: '#F3F1E8', fontWeight: 700, margin: 0 }}>NO PERFORMANCE GOALS ASSIGNED YET</h4>
            <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Assigned OKRs and quarterly goals will be displayed here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.map((g) => (
              <div key={g.id} style={{ background: '#131A15', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 241, 232, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F3F1E8' }}>{g.title}</span>
                  <Badge variant="brand">{g.status}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '6px', background: '#0D120F', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${g.progressPercentage}%`, height: '100%', background: '#7CFFB2' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#7CFFB2', fontWeight: 800 }}>{g.progressPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
