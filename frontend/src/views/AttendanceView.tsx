import React, { useState, useEffect } from 'react';
import { fetchTodayAttendance, fetchAttendanceOverview, type TodayAttendanceData, type AttendanceOverviewData } from '../api/attendance.api';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Clock, CheckCircle, LogOut, TrendingUp } from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { showToast } = useToast();
  const [todayAtt, setTodayAtt] = useState<TodayAttendanceData | null>(null);
  const [overview, setOverview] = useState<AttendanceOverviewData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadAttendance = async () => {
    try {
      const [todayRes, overRes] = await Promise.all([
        fetchTodayAttendance(),
        fetchAttendanceOverview(),
      ]);
      setTodayAtt(todayRes);
      setOverview(overRes);
    } catch {
      // Handled
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest('/attendance/check-in', { method: 'POST' });
      showToast('Checked in successfully!', 'success');
      loadAttendance();
    } catch (err: any) {
      showToast(err.message || 'Check-in failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest('/attendance/check-out', { method: 'POST' });
      showToast('Checked out successfully!', 'success');
      loadAttendance();
    } catch (err: any) {
      showToast(err.message || 'Check-out failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCheckedIn = todayAtt?.status === 'PRESENT' || todayAtt?.status === 'LATE';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Attendance & Time-Tracking</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Real-time check-in pipeline, shift tracking, and department attendance analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                background: '#7CFFB2',
                color: '#060806',
                fontWeight: 800,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <CheckCircle size={16} /> {isSubmitting ? 'Recording...' : 'Web Check-In'}
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-md)',
                background: '#E97870',
                color: '#060806',
                fontWeight: 800,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} /> {isSubmitting ? 'Recording...' : 'Web Check-Out'}
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Check-In Status"
          value={todayAtt?.checkIn ? todayAtt.checkIn : 'NOT CHECKED IN'}
          change={todayAtt?.status || 'ATTENDANCE READY'}
          trend="up"
          icon={<Clock size={16} />}
        />
        <StatCard
          title="Attendance Rate"
          value={overview?.attendancePercentage !== undefined ? `${overview.attendancePercentage.toFixed(1)}%` : 'SYSTEM READY'}
          change="Organization Analytics"
          trend="up"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          title="Present Employees"
          value={overview?.presentCount !== undefined ? `${overview.presentCount}` : 'CONNECTED'}
          change="Live Today"
          trend="neutral"
          icon={<Clock size={16} />}
        />
      </div>

      {/* Today Work Status Panel */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Today's Shift Record</h3>
          <Badge variant={isCheckedIn ? 'success' : 'warning'}>{todayAtt?.status || 'STANDBY'}</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', background: '#131A15', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', fontWeight: 600 }}>FIRST CHECK-IN</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F3F1E8', fontFamily: 'var(--font-mono)' }}>
              {todayAtt?.checkIn || '--:--'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', fontWeight: 600 }}>LAST CHECK-OUT</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F3F1E8', fontFamily: 'var(--font-mono)' }}>
              {todayAtt?.checkOut || '--:--'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', fontWeight: 600 }}>WORK DURATION</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7CFFB2', fontFamily: 'var(--font-mono)' }}>
              {todayAtt?.workDurationMinutes ? `${(todayAtt.workDurationMinutes / 60).toFixed(1)} hrs` : '0.0 hrs'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
