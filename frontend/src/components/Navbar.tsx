import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CalendarDays, CreditCard, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SystrayWidget } from './SystrayWidget';
import { Role } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, switchRole } = useAuth();

  const navItems = [
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'timeoff', label: 'Time Off & Approvals', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'payroll', label: 'Payroll & Salary', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Badge */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('employees')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    DAYFLOW
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    OI
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Odoo HRMS Engine</p>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                      isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-lg bg-white/10 border border-white/15 -z-10 shadow-inner"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Systray Widget & Role Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Systray Live Check-In Widget */}
            <SystrayWidget />

            {/* Role Switcher Pill for Hackathon Demo */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800">
              <div className="hidden lg:flex flex-col items-end mr-1 text-right">
                <span className="text-xs font-semibold text-zinc-200">{user.loginId}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{user.role} Mode</span>
              </div>
              <div className="relative group">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:border-zinc-700 cursor-pointer">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <select
                    value={user.role}
                    onChange={(e) => switchRole(e.target.value as Role)}
                    className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-zinc-200"
                  >
                    <option value="ADMIN" className="bg-zinc-900 text-zinc-200">Admin (Full Access)</option>
                    <option value="HR" className="bg-zinc-900 text-zinc-200">HR Manager</option>
                    <option value="EMPLOYEE" className="bg-zinc-900 text-zinc-200">Employee (Self-Service)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
