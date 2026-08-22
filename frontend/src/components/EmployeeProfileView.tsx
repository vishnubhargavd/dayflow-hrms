import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Landmark,
  ShieldCheck,
  Edit3,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from './EditProfileModal';
import { Employee } from '../types';

export const EmployeeProfileView: React.FC = () => {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const mockEmployee: Employee = {
    id: user.employeeId || 'emp-4',
    loginId: user.loginId,
    firstName: user.name.split(' ')[0] || 'Priya',
    lastName: user.name.split(' ')[1] || 'Sharma',
    personalEmail: user.email,
    phone: '+91 98765 43213',
    joiningYear: 2024,
    dateOfJoining: '2024-02-15',
    employeeStatus: 'ACTIVE',
    profilePicture: user.avatar,
    department: { id: 'd-1', name: user.departmentName || 'Engineering', code: 'ENG' },
    designation: { id: 'des-4', title: user.designationTitle || 'Fullstack Software Engineer' },
    monthlyWage: 48000,
    todayStatus: 'PRESENT',
    bankName: 'HDFC Bank',
    accountNumber: '••••••••4829',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
  };

  const [currentEmp, setCurrentEmp] = useState<Employee>(mockEmployee);

  return (
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-zinc-900 to-zinc-900 border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={currentEmp.profilePicture}
            alt={currentEmp.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentEmp.firstName} {currentEmp.lastName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                {currentEmp.loginId}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {currentEmp.designation?.title} • {currentEmp.department?.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all self-start md:self-center cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Contact Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Contact Details */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            <span>Personal & Contact Identity</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400">Full Name</span>
              <span className="font-bold text-white">{currentEmp.firstName} {currentEmp.lastName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400">Personal Email</span>
              <span className="font-mono text-zinc-200">{currentEmp.personalEmail}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400">Mobile Phone</span>
              <span className="font-mono text-zinc-200">{currentEmp.phone}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-400">Employment Status</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">
                {currentEmp.employeeStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Job & Organization Assignment */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-400" />
            <span>Job & Organization Profile</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400">Department</span>
              <span className="text-white font-medium">{currentEmp.department?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400">Job Title / Designation</span>
              <span className="text-white font-medium">{currentEmp.designation?.title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-800/60">
              <span className="text-zinc-400">Joining Date</span>
              <span className="text-zinc-200 font-mono">{currentEmp.dateOfJoining} (Cohort {currentEmp.joiningYear})</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-400">Reporting Line</span>
              <span className="text-zinc-200">Engineering Lead</span>
            </div>
          </div>
        </div>

        {/* Statutory Bank Account (Read-Only) */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg lg:col-span-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Statutory Bank & Tax Account (For Monthly Salary Disbursement)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase block">Bank Name</span>
              <span className="font-bold text-white mt-0.5 block">{currentEmp.bankName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase block">Account Number</span>
              <span className="font-mono text-zinc-200 mt-0.5 block">{currentEmp.accountNumber}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase block">IFSC Code</span>
              <span className="font-mono text-zinc-200 mt-0.5 block">{currentEmp.ifscCode}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase block">PAN Card</span>
              <span className="font-mono text-emerald-400 font-bold mt-0.5 block">{currentEmp.panNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        employee={currentEmp}
        onSave={(updated) => setCurrentEmp({ ...currentEmp, ...updated })}
      />
    </div>
  );
};
