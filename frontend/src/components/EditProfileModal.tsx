import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Edit3, Save, Check, Shield, User } from 'lucide-react';
import { Employee, Role } from '../types';
import { useAuth } from '../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSave: (updated: Partial<Employee>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSave,
}) => {
  const { user } = useAuth();
  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phone: employee.phone || '+91 98765 43210',
    personalEmail: employee.personalEmail || employee.user?.email || '',
    department: employee.department?.name || 'Engineering',
    designation: employee.designation?.title || 'Software Engineer',
    monthlyWage: employee.monthlyWage || 60000,
    profilePicture: employee.profilePicture || '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Partial<Employee> = {
      phone: formData.phone,
      personalEmail: formData.personalEmail,
      profilePicture: formData.profilePicture,
    };

    if (isHRorAdmin) {
      updated.firstName = formData.firstName;
      updated.lastName = formData.lastName;
      updated.department = { ...employee.department, id: employee.department?.id || 'd-1', name: formData.department, code: formData.department.slice(0, 3).toUpperCase() };
      updated.designation = { ...employee.designation, id: employee.designation?.id || 'des-1', title: formData.designation };
      updated.monthlyWage = Number(formData.monthlyWage);
    }

    onSave(updated);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Edit Profile — {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-xs text-zinc-400">
                {isHRorAdmin
                  ? 'Full administrative editing permissions enabled.'
                  : 'Self-service mode: You can modify contact details & photo.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                First Name {isHRorAdmin ? '' : '(Locked)'}
              </label>
              <input
                type="text"
                disabled={!isHRorAdmin}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Last Name {isHRorAdmin ? '' : '(Locked)'}
              </label>
              <input
                type="text"
                disabled={!isHRorAdmin}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Personal Email</label>
              <input
                type="email"
                value={formData.personalEmail}
                onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Admin Exclusive Fields */}
          {isHRorAdmin ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Monthly Wage (₹ INR)</label>
                <input
                  type="number"
                  min="15000"
                  step="1000"
                  value={formData.monthlyWage}
                  onChange={(e) => setFormData({ ...formData, monthlyWage: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Department, role, and salary structure can only be modified by HR Officers.</span>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
