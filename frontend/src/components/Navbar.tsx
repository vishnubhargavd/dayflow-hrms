import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, CalendarDays, User, LogOut, Sparkles, LogIn, Shield, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Role, TodayAttendance } from '../types';

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
  const { user, switchRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [attendance, setAttendance] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getTodayAttendance().then(setAttendance);
  }, []);

  // Close dropdown on outside click
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
          particleCount: 70,
          spread: 60,
          origin: { y: 0.1, x: 0.9 },
          colors: ['#10b981', '#a855f7', '#6366f1'],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const navTabs = [
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'timeoff', label: 'Time Off', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Company Logo & 3 Main Tabs */}
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveTab('employees')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white">DAYFLOW</span>
                <span className="block text-[10px] text-zinc-400 font-mono">Odoo HRMS</span>
              </div>
            </div>

            {/* 3 Main Navigation Tabs */}
            <nav className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 rounded-lg bg-purple-600 text-white shadow-md shadow-purple-600/30 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Avatar with Dynamic Presence Dot & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
            >
              {/* Avatar Container with Dynamic Dot */}
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.loginId}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-xl object-cover bg-zinc-800 border border-zinc-700"
                />
                {/* Presence Indicator Dot: Green when checked in, Red when checked out */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-950 transition-colors ${
                    isCheckedIn
                      ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                      : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  }`}
                  title={isCheckedIn ? 'Checked In' : 'Checked Out'}
                />
              </div>

              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-xs font-semibold text-zinc-200">{user.loginId}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{user.role}</span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Avatar Dropdown Menu & Systray Card */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl z-50 space-y-3"
                >
                  {/* User Profile Summary */}
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800/80">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.loginId}`}
                      alt="User"
                      className="w-10 h-10 rounded-xl bg-zinc-800"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {user.loginId}
                      </span>
                    </div>
                  </div>

                  {/* Systray Check-in / Check-out Card */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Systray Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCheckedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isCheckedIn ? 'Checked In' : 'Checked Out'}
                      </span>
                    </div>

                    {isCheckedIn && (
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Since: <span className="text-zinc-200 font-bold">{attendance?.checkInTime || '09:00 AM'}</span>
                      </p>
                    )}

                    <button
                      onClick={handleToggleCheckIn}
                      disabled={loading}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                        isCheckedIn
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
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

                  {/* Menu Options */}
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenMyProfile();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>My Profile</span>
                    </button>

                    {/* Role Switcher */}
                    <div className="px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Role Mode:</span>
                      </span>
                      <select
                        value={user.role}
                        onChange={(e) => switchRole(e.target.value as Role)}
                        className="bg-transparent text-[11px] font-bold text-purple-300 focus:outline-none cursor-pointer"
                      >
                        <option value="ADMIN" className="bg-zinc-900 text-zinc-200">Admin</option>
                        <option value="HR" className="bg-zinc-900 text-zinc-200">HR Manager</option>
                        <option value="EMPLOYEE" className="bg-zinc-900 text-zinc-200">Employee</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
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
