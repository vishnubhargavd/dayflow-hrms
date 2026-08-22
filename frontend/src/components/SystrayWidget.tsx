import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, Clock, Plane, CheckCircle2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { TodayAttendance } from '../types';

export const SystrayWidget: React.FC = () => {
  const [attendance, setAttendance] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    const data = await api.getTodayAttendance();
    setAttendance(data);

    if (data.record?.checkIn && !data.record.checkOut) {
      const checkInTime = new Date(data.record.checkIn).getTime();
      const now = Date.now();
      setElapsedSeconds(Math.floor(Math.max(0, now - checkInTime) / 1000));
    }
  };

  // Live stopwatch timer when checked in
  useEffect(() => {
    if (attendance?.systrayState === 'present') {
      const timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [attendance?.systrayState]);

  const formatElapsed = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleToggleCheckInOut = async () => {
    setLoading(true);
    try {
      if (attendance?.systrayState === 'present') {
        const updated = await api.checkOut();
        setAttendance(updated);
      } else {
        const updated = await api.checkIn();
        setAttendance(updated);
        setElapsedSeconds(0);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.1, x: 0.85 },
          colors: ['#10b981', '#6366f1', '#3b82f6'],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (attendance?.systrayState) {
      case 'present':
        return {
          label: 'Checked In',
          dotColor: 'bg-emerald-400',
          glow: 'glow-emerald',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'leave':
        return {
          label: 'On Leave',
          dotColor: 'bg-sky-400',
          glow: 'shadow-[0_0_15px_rgba(56,189,248,0.4)]',
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
          icon: <Plane className="w-3.5 h-3.5 text-sky-400" />,
        };
      case 'checked_out':
        return {
          label: 'Checked Out',
          dotColor: 'bg-zinc-400',
          glow: '',
          badgeBg: 'bg-zinc-800 border-zinc-700 text-zinc-300',
          icon: <Clock className="w-3.5 h-3.5 text-zinc-400" />,
        };
      default:
        return {
          label: 'Not Checked In',
          dotColor: 'bg-amber-400',
          glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const isPresent = attendance?.systrayState === 'present';
  const isLeave = attendance?.systrayState === 'leave';

  return (
    <div className="flex items-center gap-3">
      {/* Live Timer Pill (Only when checked in) */}
      <AnimatePresence>
        {isPresent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 10 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{formatElapsed(elapsedSeconds)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Systray Container */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border ${statusConfig.badgeBg}`}>
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dotColor}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.dotColor}`} />
        </span>

        {/* State Label */}
        <span className="text-xs font-medium tracking-wide flex items-center gap-1.5">
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </span>

        {/* Action Button (Disabled if on approved leave) */}
        {!isLeave && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleCheckInOut}
            disabled={loading}
            className={`ml-1 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              isPresent
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:glow-rose'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 hover:glow-emerald'
            }`}
          >
            {isPresent ? (
              <>
                <LogOut className="w-3 h-3" />
                <span>Check Out</span>
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3" />
                <span>Check In</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};
