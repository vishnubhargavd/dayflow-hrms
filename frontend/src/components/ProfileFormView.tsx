import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Pencil,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
  FileText,
  Lock,
  Plus,
  Trash2,
  ShieldAlert,
  Sparkles,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { Employee, DynamicWageBreakdown } from '../types';
import { useAuth } from '../context/AuthContext';
import { calculateDynamicWage } from '../services/api';

interface ProfileFormViewProps {
  employee: Employee;
  onBack: () => void;
}

export const ProfileFormView: React.FC<ProfileFormViewProps> = ({ employee, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'security'>('resume');

  // Resume state
  const [about, setAbout] = useState(employee.about || 'Dedicated team member committed to engineering excellence.');
  const [whatILove, setWhatILove] = useState(employee.whatILoveAboutJob || 'Collaborating with exceptional colleagues and delivering impactful solutions.');
  const [interests, setInterests] = useState(employee.interestsHobbies || 'Chess, open source coding, and outdoor sports.');
  const [skills, setSkills] = useState<string[]>(employee.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [newSkill, setNewSkill] = useState('');
  const [certs, setCerts] = useState<string[]>(employee.certifications || ['AWS Certified Cloud Practitioner']);
  const [newCert, setNewCert] = useState('');

  // Salary state
  const [wage, setWage] = useState<number>(employee.monthlyWage || 65000);
  const breakdown: DynamicWageBreakdown = calculateDynamicWage(wage);

  const isPrivileged = user.role === 'ADMIN' || user.role === 'HR';
  const isSelf = user.employeeId === employee.id || user.loginId === employee.loginId;
  const canViewSalary = isPrivileged || isSelf;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCert.trim() && !certs.includes(newCert.trim())) {
      setCerts([...certs, newCert.trim()]);
      setNewCert('');
    }
  };

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  const getDeptName = () => {
    if (!employee.department) return 'Engineering';
    if (typeof employee.department === 'string') return employee.department;
    return employee.department.name;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
      {/* Odoo ERP Breadcrumbs Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2E303E]">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#714B67]" />
            <span>Employees</span>
          </button>
          <span className="text-zinc-500">/</span>
          <span className="font-semibold text-white">
            {employee.firstName} {employee.lastName}
          </span>
        </div>

        <span className="text-xs font-mono text-[#C9A9C2] px-2.5 py-0.5 rounded bg-[#714B67]/20 border border-[#714B67]/40">
          {employee.loginId}
        </span>
      </div>

      {/* Header Profile Sheet */}
      <div className="p-6 rounded-lg bg-[#1E1F29] border border-[#2E303E] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar with Edit Pencil Badge */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-md overflow-hidden border border-[#2E303E] bg-[#16171F] p-0.5">
                <img
                  src={
                    employee.profilePicture ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`
                  }
                  alt={employee.firstName}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded bg-[#714B67] hover:bg-[#5B3C53] text-white shadow transition-transform">
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white">
                  {employee.firstName} {employee.lastName}
                </h1>
              </div>
              <p className="text-xs font-medium text-zinc-400 mt-0.5">
                {employee.jobTitle || 'Senior Software Engineer'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-[#16171F] text-zinc-300 border border-[#2E303E] text-[11px]">
                  {getDeptName()}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Key Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs w-full md:w-auto">
            <div className="p-2 rounded bg-[#16171F] border border-[#2E303E]">
              <span className="text-[10px] text-zinc-400 block">Work Email</span>
              <span className="text-zinc-200 font-mono truncate block">{employee.user?.email || `${employee.firstName.toLowerCase()}@dayflow.com`}</span>
            </div>
            <div className="p-2 rounded bg-[#16171F] border border-[#2E303E]">
              <span className="text-[10px] text-zinc-400 block">Mobile</span>
              <span className="text-zinc-200 font-mono block">{employee.phone || '+91 98765 00000'}</span>
            </div>
            <div className="p-2 rounded bg-[#16171F] border border-[#2E303E]">
              <span className="text-[10px] text-zinc-400 block">Company</span>
              <span className="text-zinc-200 block truncate">{employee.company || 'Odoo India Tech'}</span>
            </div>
            <div className="p-2 rounded bg-[#16171F] border border-[#2E303E]">
              <span className="text-[10px] text-zinc-400 block">Manager</span>
              <span className="text-zinc-200 block">{typeof employee.manager === 'string' ? employee.manager : 'Ameer Admin'}</span>
            </div>
            <div className="p-2 rounded bg-[#16171F] border border-[#2E303E] col-span-2 sm:col-span-2">
              <span className="text-[10px] text-zinc-400 block">Location</span>
              <span className="text-zinc-200 block">{employee.location || 'Bangalore Campus, Floor 4'}</span>
            </div>
          </div>
        </div>

        {/* Odoo Action Ribbon (4 Form Tabs) */}
        <div className="flex items-center gap-1 border-t border-[#2E303E] pt-4 overflow-x-auto">
          {[
            { id: 'resume', label: 'Resume', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'private', label: 'Private Info', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'salary', label: 'Salary Info (Admin)', icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: 'security', label: 'Security', icon: <Lock className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#714B67] text-white shadow-sm'
                    : 'bg-[#16171F] text-zinc-400 hover:text-zinc-200 border border-[#2E303E] hover:bg-[#252736]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Resume Tab */}
      {activeTab === 'resume' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* Left Column: Text Areas */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">About</label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2.5 bg-[#16171F] border border-[#2E303E] rounded text-xs text-zinc-200 focus:outline-none focus:border-[#714B67] leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">What I Love About My Job</label>
              <textarea
                rows={3}
                value={whatILove}
                onChange={(e) => setWhatILove(e.target.value)}
                className="w-full p-2.5 bg-[#16171F] border border-[#2E303E] rounded text-xs text-zinc-200 focus:outline-none focus:border-[#714B67] leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">My Interests & Hobbies</label>
              <textarea
                rows={3}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-2.5 bg-[#16171F] border border-[#2E303E] rounded text-xs text-zinc-200 focus:outline-none focus:border-[#714B67] leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Skills & Certifications */}
          <div className="space-y-4">
            {/* Skills Box */}
            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Skills</label>
                <span className="text-[10px] text-zinc-400 font-mono">{skills.length} listed</span>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#16171F] border border-[#2E303E] text-zinc-200 text-xs font-medium rounded flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => setSkills(skills.filter((s) => s !== skill))}
                      className="hover:text-rose-400 text-zinc-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill Input */}
              <form onSubmit={handleAddSkill} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Python, SQL)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-xs text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#714B67] hover:bg-[#5B3C53] text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Skills</span>
                </button>
              </form>
            </div>

            {/* Certifications Box */}
            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Certification</label>
                <span className="text-[10px] text-zinc-400 font-mono">{certs.length} verified</span>
              </div>

              <div className="space-y-1.5">
                {certs.map((cert) => (
                  <div
                    key={cert}
                    className="p-2 rounded bg-[#16171F] border border-[#2E303E] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 text-zinc-200 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#017E84] shrink-0" />
                      <span>{cert}</span>
                    </div>
                    <button
                      onClick={() => setCerts(certs.filter((c) => c !== cert))}
                      className="text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddCert} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add certification..."
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-xs text-zinc-200 focus:outline-none focus:border-[#714B67]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#017E84] hover:bg-[#00666A] text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Skills</span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Private Info Tab */}
      {activeTab === 'private' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* Left Column: Personal Information */}
          <div className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Personal Information</h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Date of Birth</span>
                <span className="font-mono text-zinc-200">{employee.dateOfBirth || '1996-06-12'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Residing Address</span>
                <span className="text-zinc-200 text-right max-w-xs">{employee.residingAddress || 'Flat 402, Palm Meadows, Bangalore'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Nationality</span>
                <span className="text-zinc-200">{employee.nationality || 'Indian'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Personal Email</span>
                <span className="font-mono text-zinc-200">{employee.personalEmail || 'john.doe@gmail.com'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Gender</span>
                <span className="text-zinc-200">{employee.gender || 'MALE'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Marital Status</span>
                <span className="text-zinc-200">{employee.maritalStatus || 'SINGLE'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-400">Date of Joining</span>
                <span className="font-mono text-[#10B981] font-semibold">{employee.dateOfJoining || '2022-04-15'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bank Details */}
          <div className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Bank Details</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Account Number</span>
                <span className="font-mono font-semibold text-zinc-200">{employee.accountNumber || '50100482910394'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">Bank Name</span>
                <span className="font-medium text-zinc-200">{employee.bankName || 'HDFC Bank'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">IFSC Code</span>
                <span className="font-mono text-zinc-200">{employee.ifscCode || 'HDFC0001234'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">PAN No</span>
                <span className="font-mono font-medium text-zinc-200">{employee.panNumber || 'ABCDE1234F'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2E303E]">
                <span className="text-zinc-400">UAN No</span>
                <span className="font-mono text-zinc-200">{employee.uanNumber || '101294820194'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-400">Emp Code</span>
                <span className="font-mono font-medium text-[#017E84]">{employee.empCode || 'EMP-001'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Salary Info Tab (Strict RBAC Guard) */}
      {activeTab === 'salary' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {!canViewSalary ? (
            <div className="p-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
              <div className="w-10 h-10 rounded bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-rose-200">Restricted Access (403 Forbidden)</h3>
              <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                Only Company Administrators and HR Managers have authorization to inspect organization compensation and salary structures.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Monthly Wage to Yearly Wage Card */}
              <div className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-zinc-400 font-medium">Month Wage (Input):</label>
                  <input
                    type="number"
                    step="1000"
                    value={wage}
                    onChange={(e) => setWage(Number(e.target.value))}
                    className="px-3 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-base font-mono font-bold text-[#10B981] focus:outline-none focus:border-[#714B67] w-40"
                  />
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 block">Yearly Wage (Month Wage * 12)</span>
                  <span className="text-xl font-mono font-bold text-white">{formatINR(breakdown.yearlyWage)}</span>
                </div>
              </div>

              {/* Salary Components Table */}
              <div className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Salary Components Breakdown
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#252736] text-zinc-400 uppercase text-[10px] font-semibold border-b border-[#2E303E]">
                      <tr>
                        <th className="py-2.5 px-3.5">Component</th>
                        <th className="py-2.5 px-3.5">Formula</th>
                        <th className="py-2.5 px-3.5 text-right">Monthly Amount</th>
                        <th className="py-2.5 px-3.5 text-right">Yearly Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2E303E] font-mono">
                      <tr>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">Basic Salary</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">50% of Wage</td>
                        <td className="py-2.5 px-3.5 text-right text-[#10B981] font-semibold">{formatINR(breakdown.basicSalary)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300">{formatINR(breakdown.basicSalary * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">House Rent Allowance (HRA)</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">50% of Basic</td>
                        <td className="py-2.5 px-3.5 text-right text-[#10B981] font-semibold">{formatINR(breakdown.hra)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300">{formatINR(breakdown.hra * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">Standard Allowance</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">Fixed Statutory 4167</td>
                        <td className="py-2.5 px-3.5 text-right text-[#10B981] font-semibold">{formatINR(breakdown.standardAllowance)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300">{formatINR(breakdown.standardAllowance * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">Performance Bonus</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">8.33% of Basic</td>
                        <td className="py-2.5 px-3.5 text-right text-[#10B981] font-semibold">{formatINR(breakdown.performanceBonus)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300">{formatINR(breakdown.performanceBonus * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">Leave Travel Allowance (LTA)</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">8.333% of Basic</td>
                        <td className="py-2.5 px-3.5 text-right text-[#10B981] font-semibold">{formatINR(breakdown.leaveTravelAllowance)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300">{formatINR(breakdown.leaveTravelAllowance * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-sans font-medium text-white">Fixed Allowance</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">Balance</td>
                        <td className="py-2.5 px-3.5 text-right text-[#C9A9C2] font-semibold">{formatINR(breakdown.fixedAllowance)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300">{formatINR(breakdown.fixedAllowance * 12)}</td>
                      </tr>

                      {/* Deductions */}
                      <tr className="bg-[#16171F]/50">
                        <td className="py-2.5 px-3.5 font-sans font-medium text-rose-300">PF Employee Contribution</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">12% of Basic</td>
                        <td className="py-2.5 px-3.5 text-right text-rose-400 font-semibold">-{formatINR(breakdown.pfEmployee)}</td>
                        <td className="py-2.5 px-3.5 text-right text-rose-400/80">-{formatINR(breakdown.pfEmployee * 12)}</td>
                      </tr>
                      <tr className="bg-[#16171F]/50">
                        <td className="py-2.5 px-3.5 font-sans font-medium text-zinc-300">PF Employer Contribution</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">12% of Basic</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-300 font-semibold">{formatINR(breakdown.pfEmployer)}</td>
                        <td className="py-2.5 px-3.5 text-right text-zinc-400">{formatINR(breakdown.pfEmployer * 12)}</td>
                      </tr>
                      <tr className="bg-[#16171F]/50">
                        <td className="py-2.5 px-3.5 font-sans font-medium text-rose-300">Professional Tax</td>
                        <td className="py-2.5 px-3.5 text-zinc-400 font-sans">Fixed Statutory 200</td>
                        <td className="py-2.5 px-3.5 text-right text-rose-400 font-semibold">-{formatINR(breakdown.professionalTax)}</td>
                        <td className="py-2.5 px-3.5 text-right text-rose-400/80">-{formatINR(breakdown.professionalTax * 12)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 4: Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3 max-w-xl"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Security</h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded bg-[#16171F] border border-[#2E303E] flex items-center justify-between">
              <div>
                <span className="font-medium text-white block">Password</span>
                <span className="text-zinc-400 text-[11px]">Last changed 30 days ago</span>
              </div>
              <button className="px-3 py-1 rounded bg-[#252736] hover:bg-[#2E303E] text-zinc-200 font-medium cursor-pointer">
                Reset Password
              </button>
            </div>

            <div className="p-3 rounded bg-[#16171F] border border-[#2E303E] flex items-center justify-between">
              <div>
                <span className="font-medium text-white block">Two-Factor Authentication</span>
                <span className="text-[#10B981] text-[11px]">Enabled</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[10px] font-medium border border-[#10B981]/30">
                Active
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
