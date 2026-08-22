import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, CalendarDays, User, LogOut, LogIn, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TodayAttendance } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMyProfile: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMyProfile,
  onLogout,
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [attendance, setAttendance] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getTodayAttendance().then(setAttendance);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCheckedIn = attendance?.systrayState === 'present';

  const handleToggleCheckIn = async () => {
    setLoading(true);
    try {
      if (isCheckedIn) {
        const updated = await api.checkOut();
        setAttendance(updated);
      } else {
        const updated = await api.checkIn();
        setAttendance(updated);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.1, x: 0.9 },
          colors: ['#714B67', '#017E84', '#10B981'],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogout = () => {
    setDropdownOpen(false);
    logout();
    onLogout();
  };

  const navTabs = [
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'timeoff', label: 'Time Off', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2E303E] bg-[#16171F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Odoo Logo & Primary Tabs */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveTab('employees')}
            >
              <div className="w-8 h-8 rounded bg-[#714B67] flex items-center justify-center text-white shadow-sm font-black text-sm">
                <span>D</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight">Dayflow</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#714B67]/30 text-[#A08098] font-mono font-medium border border-[#714B67]/40">
                  Odoo ERP
                </span>
              </div>
            </div>

            {/* Odoo ERP Navigation Tabs */}
            <nav className="flex items-center gap-1">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#714B67] text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1E1F29]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Avatar with Dynamic Presence Dot & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#1E1F29] border border-transparent hover:border-[#2E303E] transition-all cursor-pointer"
            >
              {/* Avatar with Presence Indicator */}
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.loginId}`}
                  alt="Profile"
                  className="w-7 h-7 rounded-md object-cover bg-[#1E1F29] border border-[#2E303E]"
                />
                {/* Dot: Emerald (#10B981) when checked in, Red (#DC2626) when checked out */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#16171F] ${
                    isCheckedIn ? 'bg-[#10B981]' : 'bg-[#DC2626]'
                  }`}
                  title={isCheckedIn ? 'Present / Checked In' : 'Checked Out'}
                />
              </div>

              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-xs font-medium text-zinc-200">{user.loginId}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{user.role}</span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Odoo Avatar Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-1.5 w-64 bg-[#1E1F29] border border-[#2E303E] rounded-lg p-2.5 shadow-xl z-50 space-y-2.5"
                >
                  {/* User Header */}
                  <div className="flex items-center gap-2.5 p-2 rounded bg-[#16171F] border border-[#2E303E]">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.loginId}`}
                      alt="User"
                      className="w-8 h-8 rounded bg-[#2E303E]"
                    />
                    <div className="truncate">
                      <p className="text-xs font-medium text-white truncate">{user.email}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-mono text-[#A08098]">{user.loginId}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-white/5 text-zinc-400 font-mono">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Systray Card */}
                  <div className="p-2.5 rounded bg-[#16171F] border border-[#2E303E] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 text-[11px]">Systray Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          isCheckedIn
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                            : 'bg-[#DC2626]/20 text-[#EF4444] border border-[#DC2626]/30'
                        }`}
                      >
                        {isCheckedIn ? 'Checked In' : 'Checked Out'}
                      </span>
                    </div>

                    {isCheckedIn && (
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Since: <span className="text-zinc-200 font-medium">{attendance?.checkInTime || '09:00 AM'}</span>
                      </p>
                    )}

                    <button
                      onClick={handleToggleCheckIn}
                      disabled={loading}
                      className={`w-full py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isCheckedIn
                          ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
                          : 'bg-[#017E84] hover:bg-[#00666A] text-white'
                      }`}
                    >
                      {isCheckedIn ? (
                        <>
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out →</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Check IN →</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenMyProfile();
                      }}
                      className="w-full px-2.5 py-1.5 rounded text-left text-zinc-300 hover:text-white hover:bg-[#252736] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#017E84]" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={handleUserLogout}
                      className="w-full px-2.5 py-1.5 rounded text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
