import React, { useState, useEffect } from 'react';
import { Badge } from '../common/Badge';
import { fetchEmployees } from '../../api/employees.api';
import { fetchAttendanceOverview } from '../../api/attendance.api';
import { Users, Building2, MapPin, Sparkles } from 'lucide-react';

export const WorkforceChapter: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('Engineering');
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [attRate, setAttRate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadRealMetrics = async () => {
      setIsLoading(true);
      try {
        const [empRes, attRes] = await Promise.all([
          fetchEmployees(1, 10).catch(() => null),
          fetchAttendanceOverview().catch(() => null),
        ]);
        if (isMounted) {
          if (empRes?.total !== undefined) {
            setTotalCount(empRes.total);
          }
          if (attRes?.attendancePercentage !== undefined) {
            setAttRate(`${attRes.attendancePercentage.toFixed(1)}%`);
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRealMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  const DEPTS = [
    { name: 'Engineering', count: totalCount !== null ? Math.round(totalCount * 0.35) : 0, rate: attRate || 'Syncing', color: '#7CFFB2' },
    { name: 'Design', count: totalCount !== null ? Math.round(totalCount * 0.15) : 0, rate: attRate || 'Syncing', color: '#A5FFC8' },
    { name: 'Human Resources', count: totalCount !== null ? Math.round(totalCount * 0.10) : 0, rate: attRate || 'Syncing', color: '#159A68' },
    { name: 'Sales & Marketing', count: totalCount !== null ? Math.round(totalCount * 0.20) : 0, rate: attRate || 'Syncing', color: '#D6C38A' },
    { name: 'Operations', count: totalCount !== null ? Math.round(totalCount * 0.20) : 0, rate: attRate || 'Syncing', color: '#087A52' },
  ];

  const activeDeptData = DEPTS.find((d) => d.name === selectedDept) || DEPTS[0];

  return (
    <section id="workforce" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* Chapter Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <span className="chapter-num" style={{ color: '#7CFFB2' }}>01 / 06 &bull; WORKFORCE</span>
          <h2 className="editorial-heading">
            <span style={{ color: '#F3F1E8' }}>ONE SYSTEM.</span><br />
            <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EVERY PERSON.
            </span>
          </h2>
        </div>

        {/* Two-Column Composition */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Column: Big Progressive Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <p style={{ color: '#A8ADA4', fontSize: '1.125rem', lineHeight: 1.65 }}>
              Centralize employee directory, reporting hierarchies, department designations, and global workforce analytics in a single unified platform.
            </p>

            {/* Asymmetric Metrics Callouts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7CFFB2', marginBottom: '4px' }}>
                  <Users size={16} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>HEADCOUNT</span>
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>
                  {isLoading ? '...' : totalCount !== null ? totalCount : 'READY'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block' }}>ACTIVE EMPLOYEES</span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#159A68', marginBottom: '4px' }}>
                  <Building2 size={16} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ATTENDANCE</span>
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>
                  {isLoading ? '...' : attRate ? attRate : 'READY'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block' }}>REAL-TIME RATE</span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D6C38A', marginBottom: '4px' }}>
                  <MapPin size={16} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>GOAL TARGET</span>
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>ACTIVE</span>
                <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block' }}>OKR MODULE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Workforce Network Map */}
          <div className="product-surface" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#7CFFB2" />
                <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F3F1E8' }}>WORKFORCE NETWORK GRAPH</span>
              </div>
              <Badge variant="brand">PRODUCT CAPABILITY</Badge>
            </div>

            {/* Department Cluster Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {DEPTS.map((dept) => {
                const isSelected = selectedDept === dept.name;
                return (
                  <button
                    key={dept.name}
                    onClick={() => setSelectedDept(dept.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? '#131A15' : '#0D120F',
                      border: isSelected ? `1px solid ${dept.color}` : '1px solid rgba(243, 241, 232, 0.08)',
                      color: isSelected ? '#F3F1E8' : '#A8ADA4',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dept.color, display: 'inline-block' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{dept.name} Cluster</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: dept.color }}>{dept.count} Members</span>
                      <Badge variant="success">{dept.rate}</Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Department Network Inspector Detail */}
            <div style={{ background: '#131A15', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(243, 241, 232, 0.08)' }}>
              <span style={{ fontSize: '0.8125rem', color: '#A8ADA4' }}>
                Active Node: <strong style={{ color: activeDeptData.color }}>{activeDeptData.name}</strong>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#45E69A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                ✓ {activeDeptData.count} Members Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
