import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Edit3,
  Save,
  Check,
  Shield,
  User,
  CreditCard,
  Landmark,
  KeyRound,
  AlertCircle,
  Building
} from 'lucide-react';
import { Employee } from '../types';
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

  const [activeTab, setActiveTab] = useState<'general' | 'bank'>('general');

  const [formData, setFormData] = useState({
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    phone: employee.phone || '+91 98765 43210',
    personalEmail: employee.personalEmail || employee.user?.email || '',
    department: employee.department?.name || 'Engineering',
    designation: employee.designation?.title || 'Software Engineer',
    monthlyWage: employee.monthlyWage || 60000,
    profilePicture: employee.profilePicture || '',
    bankName: employee.bankName || 'HDFC Bank Ltd.',
    accountNumber: employee.accountNumber || '',
    ifscCode: employee.ifscCode || 'HDFC0001234',
    panNumber: employee.panNumber || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isHRorAdmin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
      if (formData.monthlyWage < 15000) newErrors.monthlyWage = 'Minimum wage is ₹15,000';
      if (formData.accountNumber && !/^\d{9,18}$/.test(formData.accountNumber.replace(/\s/g, ''))) {
        newErrors.accountNumber = 'Account must be 9-18 digits';
      }
      if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
        newErrors.ifscCode = 'Invalid IFSC code';
      }
      if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
        newErrors.panNumber = 'Invalid PAN format';
      }
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number required';
    if (!formData.personalEmail.trim()) newErrors.personalEmail = 'Email required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updated: Partial<Employee> = {
      phone: formData.phone.trim(),
      personalEmail: formData.personalEmail.trim(),
      profilePicture: formData.profilePicture,
    };

    if (isHRorAdmin) {
      updated.firstName = formData.firstName.trim();
      updated.lastName = formData.lastName.trim();
      updated.department = {
        ...employee.department,
        id: employee.department?.id || 'd-1',
        name: formData.department,
        code: formData.department.slice(0, 3).toUpperCase(),
      };
      updated.designation = {
        ...employee.designation,
        id: employee.designation?.id || 'des-1',
        title: formData.designation.trim(),
      };
      updated.monthlyWage = Number(formData.monthlyWage);
      updated.bankName = formData.bankName.trim();
      updated.accountNumber = formData.accountNumber.trim();
      updated.ifscCode = formData.ifscCode.trim().toUpperCase();
      updated.panNumber = formData.panNumber.trim().toUpperCase();
    }

    onSave(updated);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Edit Profile & Statutory Record
              </h3>
              <p className="text-xs text-zinc-400">
                {isHRorAdmin
                  ? 'Administrator Mode: Full permissions to update bank, wage, and role.'
                  : 'Self-Service Mode: You can edit contact phone & email.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector if HR */}
        {isHRorAdmin && (
          <div className="px-5 pt-3 bg-zinc-950/80 border-b border-zinc-800 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>General Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bank'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Bank & Statutory</span>
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'general' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    First Name {isHRorAdmin ? '*' : '(Locked)'}
                  </label>
                  <input
                    type="text"
                    disabled={!isHRorAdmin}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-indigo-500"
                  />
                  {errors.firstName && <p className="text-[10px] text-rose-400 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Last Name {isHRorAdmin ? '*' : '(Locked)'}
                  </label>
                  <input
                    type="text"
                    disabled={!isHRorAdmin}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-indigo-500"
                  />
                  {errors.lastName && <p className="text-[10px] text-rose-400 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Personal Email *</label>
                  <input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  {errors.personalEmail && <p className="text-[10px] text-rose-400 mt-1">{errors.personalEmail}</p>}
                </div>
              </div>

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
                        <option value="Human Resources">Human Resources</option>
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
                    {errors.monthlyWage && <p className="text-[10px] text-rose-400 mt-1">{errors.monthlyWage}</p>}
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Role & compensation details can only be modified by HR Officers.</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Bank Name</label>
                <select
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="HDFC Bank Ltd.">HDFC Bank Ltd.</option>
                  <option value="ICICI Bank Ltd.">ICICI Bank Ltd.</option>
                  <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                  <option value="Axis Bank Ltd.">Axis Bank Ltd.</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 50100234891234"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                {errors.accountNumber && <p className="text-[10px] text-rose-400 mt-1">{errors.accountNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                  />
                  {errors.ifscCode && <p className="text-[10px] text-rose-400 mt-1">{errors.ifscCode}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                  />
                  {errors.panNumber && <p className="text-[10px] text-rose-400 mt-1">{errors.panNumber}</p>}
                </div>
              </div>
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
