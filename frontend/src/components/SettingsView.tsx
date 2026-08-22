import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Clock, Calendar, CreditCard, Building, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Dayflow Technologies Pvt. Ltd.',
    companyCode: 'DAYFLOW',
    standardShiftHours: 8.0,
    gracePeriodMinutes: 15,
    paidLeaveQuota: 12,
    sickLeaveQuota: 8,
    payrollCycleDay: 31,
    pfPercentage: 12,
    professionalTax: 200,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
            <Settings className="w-3.5 h-3.5" />
            System Configuration
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Organization & Policy Settings</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Configure enterprise rules for daily shift durations, statutory payroll formulas, and annual leave quotas.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Company Information */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>Company Information</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Organization Legal Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Company Code (Login Prefix)</label>
                <input
                  type="text"
                  value={settings.companyCode}
                  onChange={(e) => setSettings({ ...settings, companyCode: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Shift & Attendance Configuration */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Shift & Punch Policy</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Daily Workday Target</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.standardShiftHours}
                  onChange={(e) => setSettings({ ...settings, standardShiftHours: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Late Grace Period (mins)</label>
                <input
                  type="number"
                  value={settings.gracePeriodMinutes}
                  onChange={(e) => setSettings({ ...settings, gracePeriodMinutes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Leave Quotas */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Annual Leave Allocations</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Paid Annual Leave (Days)</label>
                <input
                  type="number"
                  value={settings.paidLeaveQuota}
                  onChange={(e) => setSettings({ ...settings, paidLeaveQuota: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Sick / Medical Leave (Days)</label>
                <input
                  type="number"
                  value={settings.sickLeaveQuota}
                  onChange={(e) => setSettings({ ...settings, sickLeaveQuota: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Payroll & Statutory Formulas */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Statutory Payroll Formula</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Employee PF (%)</label>
                <input
                  type="number"
                  value={settings.pfPercentage}
                  onChange={(e) => setSettings({ ...settings, pfPercentage: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Professional Tax (₹)</label>
                <input
                  type="number"
                  value={settings.professionalTax}
                  onChange={(e) => setSettings({ ...settings, professionalTax: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Settings Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Organization Policies</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
