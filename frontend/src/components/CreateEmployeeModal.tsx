import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { Employee } from '../types';
import { api } from '../services/api';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeCreated: (emp: Employee) => void;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  isOpen,
  onClose,
  onEmployeeCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [department, setDepartment] = useState('Engineering');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [monthlyWage, setMonthlyWage] = useState(50000);
  const [location, setLocation] = useState('Bangalore Campus');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createEmployee({
        firstName,
        lastName,
        personalEmail: workEmail,
        phone,
        department: { id: `d-${Date.now()}`, name: department, code: department.substring(0, 3).toUpperCase() },
        designation: { id: `des-${Date.now()}`, title: jobTitle },
        jobTitle,
        monthlyWage,
        location,
      });
      onEmployeeCreated(created);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-lg bg-[#1E1F29] border border-[#2E303E] rounded-lg p-5 shadow-2xl z-10 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2E303E]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#714B67]/20 text-[#C9A9C2] flex items-center justify-center border border-[#714B67]/30">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Create Employee</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Generates deterministic Login ID (e.g. OIJODO20260001)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#16171F] hover:bg-[#252736] text-zinc-400 hover:text-white border border-[#2E303E] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rivera"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex.r@dayflow.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67] cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Backend Engineer"
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Monthly Wage (Base CTC)</label>
                <input
                  type="number"
                  required
                  min="15000"
                  step="1000"
                  value={monthlyWage}
                  onChange={(e) => setMonthlyWage(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 font-mono focus:outline-none focus:border-[#714B67]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bangalore Campus"
                  className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2E303E]">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-[#16171F] hover:bg-[#252736] text-zinc-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 rounded bg-[#714B67] hover:bg-[#5B3C53] text-white font-medium shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{submitting ? 'Generating...' : 'Save & Provision'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
