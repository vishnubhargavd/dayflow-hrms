import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, DollarSign, Users, Plus, Filter, Sparkles, Building } from 'lucide-react';
import { Employee } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SpotlightCard } from './SpotlightCard';

interface EmployeeKanbanProps {
  onSelectEmployee: (emp: Employee, defaultTab?: 'profile' | 'salary' | 'attendance') => void;
  onOpenAddEmployee?: () => void;
}

export const EmployeeKanban: React.FC<EmployeeKanbanProps> = ({ onSelectEmployee, onOpenAddEmployee }) => {
  const { user } = useAuth();
  const { employees } = useData();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const departments = ['ALL', ...Array.from(new Set(employees.map((e) => e.department?.name).filter(Boolean) as string[]))];

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
          spotlight: 'rgba(16, 185, 129, 0.18)',
        };
      case 'ON_LEAVE':
        return {
          label: 'On Leave',
          dot: 'bg-sky-400',
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
          spotlight: 'rgba(56, 189, 248, 0.18)',
        };
      case 'HALF_DAY':
        return {
          label: 'Half Day',
          dot: 'bg-indigo-400',
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
          spotlight: 'rgba(99, 102, 241, 0.18)',
        };
      default:
        return {
          label: 'Offline',
          dot: 'bg-zinc-500',
          bg: 'bg-zinc-800 border-zinc-700 text-zinc-400',
          spotlight: 'rgba(113, 113, 122, 0.12)',
        };
    }
  };

  const isPrivileged = user.role === 'ADMIN' || user.role === 'HR';

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Employee Directory & Kanban</span>
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono font-medium border border-indigo-500/30">
              {filteredEmployees.length} Members
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Click any employee card to inspect personal records, modify salary structures, and view shifts.
          </p>
        </div>

        {onOpenAddEmployee && (
          <button
            onClick={onOpenAddEmployee}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, employee code, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredEmployees.map((emp) => {
            const badge = getStatusBadge(emp.todayStatus);
            return (
              <SpotlightCard
                key={emp.id}
                spotlightColor={badge.spotlight}
                className="cursor-pointer group"
                onClick={() => onSelectEmployee(emp, 'profile')}
              >
                <div className="p-5 flex flex-col justify-between h-full space-y-4">
                  {/* Top: Avatar, Name & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={emp.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`}
                          alt={emp.firstName}
                          className="w-12 h-12 rounded-2xl object-cover border border-zinc-700 group-hover:border-indigo-500/50 transition-colors shadow-md"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${badge.dot}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {emp.firstName} {emp.lastName}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">
                          {emp.designation?.title}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Middle Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-zinc-800/50">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Department</span>
                      <span className="text-zinc-300 font-medium">{emp.department?.name || 'General'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Employee ID</span>
                      <span className="font-mono text-zinc-300 font-bold">{emp.loginId}</span>
                    </div>
                  </div>

                  {/* Bottom: Fast Salary & Shift links */}
                  <div className="flex items-center justify-between pt-1">
                    {isPrivileged && emp.monthlyWage ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmployee(emp, 'salary');
                        }}
                        className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>₹{emp.monthlyWage.toLocaleString('en-IN')}/mo</span>
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-500 font-mono">Cohort {emp.joiningYear}</span>
                    )}

                    <span className="text-xs text-zinc-400 group-hover:text-white font-semibold flex items-center gap-1 transition-colors">
                      <span>View Record</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
