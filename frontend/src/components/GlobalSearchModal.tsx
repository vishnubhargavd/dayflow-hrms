import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Calendar, CreditCard, FileText, Settings, ArrowRight, X } from 'lucide-react';
import { Employee } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onNavigateTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  employees,
  onSelectEmployee,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search modal
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'Command Center Dashboard', tab: 'dashboard', icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
    { label: 'Employee Directory & Kanban', tab: 'employees', icon: <Users className="w-4 h-4 text-indigo-400" /> },
    { label: 'Attendance & Punch Station', tab: 'attendance', icon: <Calendar className="w-4 h-4 text-sky-400" /> },
    { label: 'Time Off & Leave Approvals', tab: 'timeoff', icon: <Calendar className="w-4 h-4 text-teal-400" /> },
    { label: 'Payroll & Statutory Wages', tab: 'payroll', icon: <CreditCard className="w-4 h-4 text-purple-400" /> },
    { label: 'Executive Analytics & Reports', tab: 'reports', icon: <FileText className="w-4 h-4 text-amber-400" /> },
    { label: 'Company Documents & Policies', tab: 'documents', icon: <FileText className="w-4 h-4 text-rose-400" /> },
    { label: 'System & Policy Settings', tab: 'settings', icon: <Settings className="w-4 h-4 text-zinc-400" /> },
  ];

  const filteredEmployees = employees.filter(
    (e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      e.loginId.toLowerCase().includes(query.toLowerCase()) ||
      (e.designation?.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.department?.name || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search employees, commands, documents, or salary tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Employee Matches */}
          {query.trim() && (
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-1.5 block">
                Employees ({filteredEmployees.length})
              </span>
              {filteredEmployees.length > 0 ? (
                <div className="space-y-1">
                  {filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => {
                        onSelectEmployee(emp);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-zinc-800/80 flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`}
                          alt={emp.firstName}
                          className="w-8 h-8 rounded-full border border-zinc-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            {emp.designation?.title} • {emp.department?.name} ({emp.loginId})
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 px-3 py-2">No matching employees found.</p>
              )}
            </div>
          )}

          {/* Quick Navigation Shortcuts */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-1.5 block">
              Quick Navigation
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {quickNav.map((nav, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigateTab(nav.tab);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800/60 text-left flex items-center gap-2.5 transition-colors group cursor-pointer"
                >
                  {nav.icon}
                  <span className="text-xs text-zinc-300 group-hover:text-white font-medium truncate">
                    {nav.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between px-4">
          <span>Navigation: Click or press ESC to close</span>
          <span>Dayflow Unified Search</span>
        </div>
      </motion.div>
    </div>
  );
};
