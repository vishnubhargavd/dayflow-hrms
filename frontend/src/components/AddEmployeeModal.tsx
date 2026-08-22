import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserPlus,
  Building,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Check,
  CreditCard,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Landmark,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { Employee, Role } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (emp: Partial<Employee>) => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAddEmployee }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'credentials'>('profile');

  // Profile Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [monthlyWage, setMonthlyWage] = useState<number>(60000);
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);

  // Bank & Statutory Fields
  const [bankName, setBankName] = useState('HDFC Bank Ltd.');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [panNumber, setPanNumber] = useState('');

  // User ID & Password Credentials
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('Dayflow@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [assignedRole, setAssignedRole] = useState<Role>('EMPLOYEE');

  // Validation Errors & Success State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Complete Form Flush / Reset Function
  const resetForm = useCallback(() => {
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDepartment('Engineering');
    setDesignation('Software Engineer');
    setMonthlyWage(60000);
    setDateOfJoining(new Date().toISOString().split('T')[0]);
    setBankName('HDFC Bank Ltd.');
    setAccountNumber('');
    setIfscCode('HDFC0001234');
    setPanNumber('');
    setLoginId(`OIUSXX${year}${randomSeq}`);
    setPassword('Dayflow@2026');
    setShowPassword(false);
    setAssignedRole('EMPLOYEE');
    setErrors({});
    setActiveTab('profile');
    setIsSuccess(false);
  }, []);

  // Flush and clean all state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Auto-update Login ID whenever First Name or Last Name changes
  useEffect(() => {
    const fInitial = firstName.trim().slice(0, 2).toUpperCase() || 'US';
    const lInitial = lastName.trim().slice(0, 2).toUpperCase() || 'XX';
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    setLoginId(`OI${fInitial}${lInitial}${year}${randomSeq}`);
  }, [firstName, lastName]);

  const generateRandomPassword = () => {
    const specialChars = '@#$!';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const char = specialChars[Math.floor(Math.random() * specialChars.length)];
    const generated = `Dayflow${char}${randomNum}`;
    setPassword(generated);
    if (errors.password) {
      const newErr = { ...errors };
      delete newErr.password;
      setErrors(newErr);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500'];

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Profile validations
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'Min 2 characters';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Invalid email address (e.g. name@dayflow.com)';
    }

    const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Enter valid 10+ digit phone number';
    }

    if (!monthlyWage || monthlyWage < 15000) {
      newErrors.monthlyWage = 'Minimum statutory monthly wage is ₹15,000';
    }

    if (!dateOfJoining) {
      newErrors.dateOfJoining = 'Joining date is required';
    }

    // 2. Bank validations
    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Bank account number is required';
    } else if (!/^\d{9,18}$/.test(accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'Must be 9 to 18 digits';
    }

    if (!ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC Code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid format (e.g. HDFC0001234)';
    }

    if (!panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
    }

    // 3. Credential validations
    if (!loginId.trim()) {
      newErrors.loginId = 'Login ID is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Initial password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);

    if (newErrors.firstName || newErrors.lastName || newErrors.email || newErrors.phone || newErrors.monthlyWage || newErrors.dateOfJoining) {
      setActiveTab('profile');
    } else if (newErrors.bankName || newErrors.accountNumber || newErrors.ifscCode || newErrors.panNumber) {
      setActiveTab('bank');
    } else if (newErrors.loginId || newErrors.password) {
      setActiveTab('credentials');
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    const newEmp: Partial<Employee> = {
      id: `emp-${Date.now()}`,
      loginId: loginId.trim().toUpperCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      personalEmail: email.trim(),
      phone: phone.trim(),
      joiningYear: new Date(dateOfJoining).getFullYear() || 2026,
      dateOfJoining,
      employeeStatus: 'ACTIVE',
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      department: {
        id: `d-${Date.now()}`,
        name: department,
        code: department.slice(0, 3).toUpperCase(),
      },
      designation: {
        id: `des-${Date.now()}`,
        title: designation.trim() || 'Software Engineer',
      },
      monthlyWage: Number(monthlyWage),
      todayStatus: 'PRESENT',
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      panNumber: panNumber.trim().toUpperCase(),
      user: {
        email: email.trim(),
        role: assignedRole,
        accountStatus: 'ACTIVE',
      },
    };

    onAddEmployee(newEmp);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Onboard New Employee</h3>
              <p className="text-xs text-zinc-400">Complete employee profile, bank statutory data, and issue login credentials.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetForm}
              title="Flush & Reset Form"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-Section Tabs */}
        <div className="px-5 pt-3 bg-zinc-950/80 border-b border-zinc-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1. Profile & Role</span>
            {(errors.firstName || errors.lastName || errors.email || errors.phone || errors.monthlyWage) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bank'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>2. Bank & Statutory</span>
            {(errors.bankName || errors.accountNumber || errors.ifscCode || errors.panNumber) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>3. Login & Credentials</span>
            {(errors.loginId || errors.password) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* TAB 1: Profile & Employment Details */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors({ ...errors, firstName: '' });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                      errors.firstName ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.firstName && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Reddy"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors({ ...errors, lastName: '' });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                      errors.lastName ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.lastName && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Work Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="ananya.reddy@dayflow.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        errors.email ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        errors.phone ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Fullstack Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Monthly Wage (₹ INR) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-zinc-500 font-bold absolute left-3 top-1/2 -translate-y-1/2 text-xs">₹</span>
                    <input
                      type="number"
                      min="15000"
                      step="1000"
                      value={monthlyWage}
                      onChange={(e) => {
                        setMonthlyWage(Number(e.target.value));
                        if (errors.monthlyWage) setErrors({ ...errors, monthlyWage: '' });
                      }}
                      className={`w-full pl-8 pr-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white font-mono focus:outline-none transition-colors ${
                        errors.monthlyWage ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.monthlyWage && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.monthlyWage}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Joining Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfJoining}
                    onChange={(e) => {
                      setDateOfJoining(e.target.value);
                      if (errors.dateOfJoining) setErrors({ ...errors, dateOfJoining: '' });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white focus:outline-none transition-colors ${
                      errors.dateOfJoining ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.dateOfJoining && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.dateOfJoining}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('bank')}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Next: Bank & Statutory Data</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Bank & Statutory Compliance */}
          {activeTab === 'bank' && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-400">
                <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bank details are encrypted and used for monthly automated payroll direct deposit.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Bank Name <span className="text-rose-400">*</span>
                </label>
                <select
                  value={bankName}
                  onChange={(e) => {
                    setBankName(e.target.value);
                    if (errors.bankName) setErrors({ ...errors, bankName: '' });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
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
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Bank Account Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 50100234891234"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      if (errors.accountNumber) setErrors({ ...errors, accountNumber: '' });
                    }}
                    className={`w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white font-mono placeholder-zinc-500 focus:outline-none transition-colors ${
                      errors.accountNumber ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errors.accountNumber && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.accountNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    IFSC Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={ifscCode}
                    onChange={(e) => {
                      setIfscCode(e.target.value.toUpperCase());
                      if (errors.ifscCode) setErrors({ ...errors, ifscCode: '' });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white font-mono uppercase placeholder-zinc-500 focus:outline-none transition-colors ${
                      errors.ifscCode ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.ifscCode && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.ifscCode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    PAN Card Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => {
                      setPanNumber(e.target.value.toUpperCase());
                      if (errors.panNumber) setErrors({ ...errors, panNumber: '' });
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl bg-zinc-950 border text-xs text-white font-mono uppercase placeholder-zinc-500 focus:outline-none transition-colors ${
                      errors.panNumber ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.panNumber && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.panNumber}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('credentials')}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Next: Login & Password</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Login Credentials & Access Control */}
          {activeTab === 'credentials' && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Company Login ID</span>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">{loginId || 'Generating...'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fInitial = firstName.trim().slice(0, 2).toUpperCase() || 'US';
                    const lInitial = lastName.trim().slice(0, 2).toUpperCase() || 'XX';
                    const year = new Date().getFullYear();
                    const randomSeq = Math.floor(1000 + Math.random() * 9000);
                    setLoginId(`OI${fInitial}${lInitial}${year}${randomSeq}`);
                  }}
                  title="Regenerate Login ID"
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Initial Password <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={`w-full pl-9 pr-9 py-2 rounded-xl bg-zinc-950 border text-xs text-white font-mono focus:outline-none transition-colors ${
                      errors.password ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-zinc-800 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}

                {/* Password Strength Indicator */}
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[0, 1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 rounded-full ${
                          step < strength ? strengthColors[strength - 1] : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Security Rating: {strengthLabels[Math.max(0, strength - 1)]}</span>
                    <span>8+ chars, upper, number, symbol</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">System Access Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignedRole('EMPLOYEE')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      assignedRole === 'EMPLOYEE'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Employee (Self-Service)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignedRole('HR')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      assignedRole === 'HR' || assignedRole === 'ADMIN'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>HR Administrator</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSuccess}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Employee Onboarded Successfully!</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create & Issue Workstation ID</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
