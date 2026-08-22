import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, Mail, Phone, ChevronRight, Sparkles, DollarSign, CalendarCheck } from 'lucide-react';
import { Employee, Role } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface EmployeeKanbanProps {
  onSelectEmployee: (emp: Employee, defaultTab?: 'profile' | 'salary' | 'attendance') => void;
}

export const EmployeeKanban: React.FC<EmployeeKanbanProps> = ({ onSelectEmployee }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const data = await api.getEmployees();
    setEmployees(data);
  };

  const departments = ['ALL', ...Array.from(new Set(employees.map((e) => e.department?.name).filter(Boolean)))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(search.toLowerCase()) ||
      (emp.designation?.title || '').toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.department?.name === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PRESENT':
        return {
          label: 'Present',
          dot: 'bg-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        };
      case 'ON_LEAVE':
        return {
          label: 'On Leave',
          dot: 'bg-sky-400',
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
        };
      case 'HALF_DAY':
        return {
          label: 'Half Day',
          dot: 'bg-indigo-400',
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
        };
      default:
        return {
          label: 'Absent / Out',
          dot: 'bg-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        };
    }
  };

  return (
    <div className="w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Employee Directory & Kanban</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono font-medium border border-zinc-700">
              {filteredEmployees.length} Total
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time workforce statuses, statutory salary breakdowns, and profile inspector.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {departments.map((dept) => {
          const isSelected = selectedDept === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept as string)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:bg-zinc-800'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredEmployees.map((emp, index) => {
            const statusBadge = getStatusBadge(emp.todayStatus);
            return (
              <motion.div
                key={emp.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                className="group relative p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={() => onSelectEmployee(emp, 'profile')}
              >
                {/* Ambient Card Background Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Top Bar: Login ID & Attendance Dot */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-indigo-300 font-mono text-[10px] font-bold border border-zinc-800 group-hover:border-indigo-500/40 transition-colors">
                      {emp.loginId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1.5 ${statusBadge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`} />
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  {/* Avatar & Core Info */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative">
                      <img
                        src={emp.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`}
                        alt={emp.firstName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 group-hover:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {emp.firstName} {emp.lastName}
                      </h4>
                      <p className="text-xs text-zinc-400 font-medium truncate">{emp.designation?.title || 'Staff'}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{emp.department?.name || 'General'}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Quick Action Buttons */}
                <div className="mt-2 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Joined {emp.joiningYear}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Admin Salary Quick Action */}
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmployee(emp, 'salary');
                        }}
                        title="View Statutory Salary Breakdown"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-300 border border-zinc-800 transition-colors"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmployee(emp, 'profile');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 group-hover:bg-indigo-600 text-[11px] font-semibold text-zinc-300 group-hover:text-white border border-zinc-800 group-hover:border-indigo-500 transition-all flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
