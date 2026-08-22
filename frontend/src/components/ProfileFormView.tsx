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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb / Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employees</span>
        </button>

        <span className="text-xs font-mono text-zinc-400">
          Viewing: <strong className="text-purple-300">{employee.loginId}</strong>
        </span>
      </div>

      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-2xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar with Edit Pencil Badge */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-zinc-950 p-1">
                <img
                  src={
                    employee.profilePicture ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`
                  }
                  alt={employee.firstName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-transform group-hover:scale-110">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white">
                  {employee.firstName} {employee.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-xs font-bold">
                  {employee.loginId}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-400 mt-0.5">
                {employee.jobTitle || 'Senior Software Engineer'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-950 text-zinc-300 border border-zinc-800 text-[11px] font-medium">
                  {getDeptName()}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  Active Employee
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs w-full md:w-auto">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block font-medium">Work Email</span>
              <span className="text-zinc-200 font-mono truncate block">{employee.user?.email || `${employee.firstName.toLowerCase()}@dayflow.com`}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block font-medium">Mobile</span>
              <span className="text-zinc-200 font-mono block">{employee.phone || '+91 98765 00000'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block font-medium">Company</span>
              <span className="text-zinc-200 block truncate">{employee.company || 'Odoo India Tech'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block font-medium">Manager</span>
              <span className="text-zinc-200 block">{typeof employee.manager === 'string' ? employee.manager : 'Ameer Admin'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 col-span-2 sm:col-span-2">
              <span className="text-[10px] text-zinc-400 block font-medium">Location</span>
              <span className="text-zinc-200 block">{employee.location || 'Bangalore Campus, Floor 4'}</span>
            </div>
          </div>
        </div>

        {/* 4 Form Tabs */}
        <div className="flex items-center gap-2 border-t border-zinc-800 pt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'resume', label: 'Resume', icon: <FileText className="w-4 h-4" /> },
            { id: 'private', label: 'Private Info', icon: <User className="w-4 h-4" /> },
            { id: 'salary', label: 'Salary Info (Admin)', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:bg-zinc-800'
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left Column: Text Areas */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">About Me</label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">What I Love About My Job</label>
              <textarea
                rows={3}
                value={whatILove}
                onChange={(e) => setWhatILove(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300">My Interests and Hobbies</label>
              <textarea
                rows={3}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column: Skills & Certifications */}
          <div className="space-y-4">
            {/* Skills Box */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Skills & Competencies</label>
                <span className="text-[10px] text-zinc-400 font-mono">{skills.length} listed</span>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => setSkills(skills.filter((s) => s !== skill))}
                      className="hover:text-rose-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill Input */}
              <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. GraphQL)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </form>
            </div>

            {/* Certifications Box */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Certifications & Honors</label>
                <span className="text-[10px] text-zinc-400 font-mono">{certs.length} verified</span>
              </div>

              <div className="space-y-2">
                {certs.map((cert) => (
                  <div
                    key={cert}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 text-zinc-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                    <button
                      onClick={() => setCerts(certs.filter((c) => c !== cert))}
                      className="text-zinc-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddCert} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add certification (e.g. AWS Solutions Architect)..."
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Cert</span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Private Info Tab */}
      {activeTab === 'private' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left Column: Personal Information */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">Personal Details</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Date of Birth</span>
                <span className="font-mono text-zinc-200">{employee.dateOfBirth || '1996-06-12'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Residing Address</span>
                <span className="text-zinc-200 text-right max-w-xs">{employee.residingAddress || 'Flat 402, Palm Meadows, Bangalore'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Nationality</span>
                <span className="text-zinc-200">{employee.nationality || 'Indian'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Personal Email</span>
                <span className="font-mono text-zinc-200">{employee.personalEmail || 'john.doe@gmail.com'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Gender</span>
                <span className="text-zinc-200">{employee.gender || 'MALE'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Marital Status</span>
                <span className="text-zinc-200">{employee.maritalStatus || 'SINGLE'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Date of Joining</span>
                <span className="font-mono text-emerald-400 font-bold">{employee.dateOfJoining || '2022-04-15'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bank Details */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">Bank & Statutory Accounts</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Account Number</span>
                <span className="font-mono font-bold text-zinc-200">{employee.accountNumber || '50100482910394'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">Bank Name</span>
                <span className="font-semibold text-zinc-200">{employee.bankName || 'HDFC Bank'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">IFSC Code</span>
                <span className="font-mono text-zinc-200">{employee.ifscCode || 'HDFC0001234'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">PAN Card Identifier</span>
                <span className="font-mono font-bold text-zinc-200">{employee.panNumber || 'ABCDE1234F'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/60">
                <span className="text-zinc-400">UAN Number (EPFO)</span>
                <span className="font-mono text-zinc-200">{employee.uanNumber || '101294820194'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Employee Code</span>
                <span className="font-mono font-bold text-purple-300">{employee.empCode || 'EMP-001'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Salary Info Tab (Strict RBAC Guard) */}
      {activeTab === 'salary' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {!canViewSalary ? (
            <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-rose-200">Restricted Access (403 Forbidden)</h3>
              <p className="text-xs text-rose-300/80 max-w-md mx-auto">
                Only Company Administrators and HR Managers have authorization to inspect organization compensation and salary structures.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Monthly Wage to Yearly Wage Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Statutory Salary Engine
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-zinc-400 font-medium">Month Wage Input:</label>
                    <input
                      type="number"
                      step="1000"
                      value={wage}
                      onChange={(e) => setWage(Number(e.target.value))}
                      className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-base font-mono font-black text-emerald-400 focus:outline-none focus:border-purple-500 w-44"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-zinc-400 block font-medium">Yearly Wage CTC (12 × Month)</span>
                  <span className="text-2xl font-mono font-black text-white">{formatINR(breakdown.yearlyWage)}</span>
                </div>
              </div>

              {/* Statutory Components Table */}
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Statutory Earnings & Allowances Breakdown
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Component</th>
                        <th className="py-3 px-4">Statutory Formula</th>
                        <th className="py-3 px-4 text-right">Monthly Amount</th>
                        <th className="py-3 px-4 text-right">Yearly Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      <tr>
                        <td className="py-3 px-4 font-sans font-semibold text-white">Basic Salary</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">50% of Monthly Wage</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">{formatINR(breakdown.basicSalary)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{formatINR(breakdown.basicSalary * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-sans font-semibold text-white">House Rent Allowance (HRA)</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">50% of Basic Salary</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">{formatINR(breakdown.hra)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{formatINR(breakdown.hra * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-sans font-semibold text-white">Standard Allowance</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">Fixed Statutory Allowance</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">{formatINR(breakdown.standardAllowance)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{formatINR(breakdown.standardAllowance * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-sans font-semibold text-white">Performance Bonus</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">8.33% of Basic Salary</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">{formatINR(breakdown.performanceBonus)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{formatINR(breakdown.performanceBonus * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-sans font-semibold text-white">Leave Travel Allowance (LTA)</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">8.333% of Basic Salary</td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-bold">{formatINR(breakdown.leaveTravelAllowance)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{formatINR(breakdown.leaveTravelAllowance * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-sans font-semibold text-white">Fixed Allowance</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">Balancing Allowance</td>
                        <td className="py-3 px-4 text-right text-purple-300 font-bold">{formatINR(breakdown.fixedAllowance)}</td>
                        <td className="py-3 px-4 text-right text-zinc-300">{formatINR(breakdown.fixedAllowance * 12)}</td>
                      </tr>

                      {/* Deductions */}
                      <tr className="bg-zinc-950/40">
                        <td className="py-3 px-4 font-sans font-semibold text-rose-300">PF Employee Contribution</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">12% of Basic Salary</td>
                        <td className="py-3 px-4 text-right text-rose-400 font-bold">-{formatINR(breakdown.pfEmployee)}</td>
                        <td className="py-3 px-4 text-right text-rose-400/80">-{formatINR(breakdown.pfEmployee * 12)}</td>
                      </tr>
                      <tr className="bg-zinc-950/40">
                        <td className="py-3 px-4 font-sans font-semibold text-zinc-300">PF Employer Contribution</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">12% of Basic Salary</td>
                        <td className="py-3 px-4 text-right text-zinc-300 font-bold">{formatINR(breakdown.pfEmployer)}</td>
                        <td className="py-3 px-4 text-right text-zinc-400">{formatINR(breakdown.pfEmployer * 12)}</td>
                      </tr>
                      <tr className="bg-zinc-950/40">
                        <td className="py-3 px-4 font-sans font-semibold text-rose-300">Professional Tax (PT)</td>
                        <td className="py-3 px-4 text-zinc-400 font-sans">Fixed Statutory Tax</td>
                        <td className="py-3 px-4 text-right text-rose-400 font-bold">-{formatINR(breakdown.professionalTax)}</td>
                        <td className="py-3 px-4 text-right text-rose-400/80">-{formatINR(breakdown.professionalTax * 12)}</td>
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4 max-w-xl"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">Security & Credentials</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Password Status</span>
                <span className="text-zinc-400 text-[11px]">Last changed 30 days ago</span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold cursor-pointer">
                Reset Password
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Two-Factor Authentication</span>
                <span className="text-emerald-400 text-[11px] font-medium">Enabled (Authenticator App)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
