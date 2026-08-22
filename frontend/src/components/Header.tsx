import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  Calendar,
  Sparkles,
  Menu,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  LogOut,
  Shield,
  UserCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SystrayWidget } from './SystrayWidget';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenAddEmployee: () => void;
  onOpenApplyLeave: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenAddEmployee,
  onOpenApplyLeave,
}) => {
  const { user, logout } = useAuth();
  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: isHRorAdmin ? 'Leave Request from Priya Sharma' : 'Your August Payslip is Ready',
      desc: isHRorAdmin ? 'Applied for 2 days Sick Leave (Aug 25-26)' : 'August 2026 salary has been credited to your bank.',
      time: '10 mins ago',
      unread: true,
      icon: <Calendar className="w-3.5 h-3.5 text-teal-400" />,
    },
    {
      id: 'n-2',
      title: isHRorAdmin ? '3 Approvals Require Attention' : 'Shift Logged Successfully',
      desc: isHRorAdmin ? 'Pending requests awaiting HR signoff.' : 'Today check-in recorded at 09:12 AM.',
      time: '1 hour ago',
      unread: true,
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'n-3',
      title: isHRorAdmin ? 'August Payroll Ready for Audit' : 'Leave Request Approved',
      desc: isHRorAdmin ? '₹24.8L estimated liabilities calculated.' : 'Your July leave application was approved by HR.',
      time: '3 hours ago',
      unread: false,
      icon: <CreditCard className="w-3.5 h-3.5 text-emerald-400" />,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 lg:hidden transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Trigger */}
        <div
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 cursor-pointer transition-all group"
        >
          <Search className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          <span className="truncate flex-1">
            {isHRorAdmin ? 'Search employees, documents, salary tools...' : 'Search my records, attendance, documents...'}
          </span>
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Date Selector, Notifications, Quick Actions, Systray */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date Range Badge (Desktop for HR) */}
        {isHRorAdmin && (
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">18 – 24 August 2026</span>
          </div>
        )}

        {/* Systray Live Clock-In Station */}
        <SystrayWidget />

        {/* Context-Aware Quick Action CTA */}
        {isHRorAdmin ? (
          <button
            onClick={onOpenAddEmployee}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Employee</span>
          </button>
        ) : (
          <button
            onClick={onOpenApplyLeave}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Apply Leave</span>
          </button>
        )}

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Alerts & Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-zinc-800/50 transition-colors flex items-start gap-3 ${
                        n.unread ? 'bg-zinc-900/90' : 'opacity-70'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0">
                        {n.icon}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-white truncate">{n.title}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{n.desc}</p>
                        <span className="text-[10px] text-zinc-500 font-mono mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-zinc-950 border-t border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-500">Dayflow Unified Alert Center</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar with Quick Sign Out */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-zinc-700"
          />
          <button
            onClick={logout}
            title="Sign Out"
            className="hidden sm:flex p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
