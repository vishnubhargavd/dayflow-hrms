import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, Clock, Plane, CheckCircle2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../context/DataContext';

export const SystrayWidget: React.FC = () => {
  const { todayAttendance, punchIn, punchOut } = useData();
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(3.5 * 3600);

  const isPresent = todayAttendance?.status === 'CHECKED_IN' || todayAttendance?.systrayState === 'present';
  const isLeave = todayAttendance?.systrayState === 'leave';

  // Live stopwatch timer when checked in
  useEffect(() => {
    if (isPresent) {
      const timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPresent]);

  const formatElapsed = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleToggleCheckInOut = async () => {
    setLoading(true);
    try {
      if (isPresent) {
        await punchOut();
      } else {
        await punchIn();
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

  return (
    <div className="flex items-center gap-3">
      {/* Live Timer Pill (Only when checked in) */}
      <AnimatePresence>
        {isPresent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 10 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-inner"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{formatElapsed(elapsedSeconds)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Systray Container */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border ${
          isPresent
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : isLeave
            ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
        }`}
      >
        {/* Pulsing Status Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isPresent ? 'bg-emerald-400' : isLeave ? 'bg-sky-400' : 'bg-zinc-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isPresent ? 'bg-emerald-400' : isLeave ? 'bg-sky-400' : 'bg-zinc-400'
            }`}
          />
        </span>

        {/* State Label */}
        <span className="text-xs font-medium tracking-wide flex items-center gap-1.5">
          {isPresent ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Checked In</span>
            </>
          ) : isLeave ? (
            <>
              <Plane className="w-3.5 h-3.5 text-sky-400" />
              <span>On Leave</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Checked Out</span>
            </>
          )}
        </span>

        {/* Action Button */}
        {!isLeave && (
          <button
            onClick={handleToggleCheckInOut}
            disabled={loading}
            className={`ml-1 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isPresent
                ? 'bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40'
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
          </button>
        )}
      </div>
    </div>
  );
};
