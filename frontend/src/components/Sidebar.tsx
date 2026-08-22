import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  CheckSquare,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  UserCheck,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onToggle,
}) => {
  const { user, logout } = useAuth();
  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  // Navigation Links strictly configured by Least Privilege Principle
  const employeeNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'myprofile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'attendance', label: 'My Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'timeoff', label: 'Leave & Time Off', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'payroll', label: 'My Payroll', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'documents', label: 'My Documents', icon: <FileText className="w-4 h-4" /> },
  ];

  const adminPrimaryNav = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'timeoff', label: 'Leave Requests', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'payroll', label: 'Payroll Management', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const adminManagementNav = [
    { id: 'approvals', label: 'Approvals Queue', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'documents', label: 'Document Vault', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-zinc-950/95 border-r border-zinc-800/80 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    Dayflow
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isHRorAdmin ? 'HR ADMIN' : 'EMPLOYEE'}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium">Every workday, perfectly aligned.</p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-zinc-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-none">
            {!isHRorAdmin ? (
              /* EMPLOYEE WORKSPACE NAVIGATION (Principle of Least Privilege) */
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Self-Service Navigation
                </span>
                {employeeNav.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) onToggle();
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* HR ADMIN & OFFICER WORKSPACE NAVIGATION */
              <>
                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    HR Core Operations
                  </span>
                  {adminPrimaryNav.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) onToggle();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Management & Analytics
                  </span>
                  {adminManagementNav.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) onToggle();
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Profile Preview & Sign Out Action */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90">
          <div className="p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800/60 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
              </div>
              <div className="truncate">
                <span className="block text-xs font-bold text-white truncate">
                  {user.name}
                </span>
                <span className="block text-[10px] text-zinc-400 font-mono truncate">
                  {user.designationTitle}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out & Lock Station"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
