import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { EmployeeKanban } from './components/EmployeeKanban';
import { ProfileDrawer } from './components/ProfileDrawer';
import { LeaveApprovalQueue } from './components/LeaveApprovalQueue';
import { AttendanceView } from './components/AttendanceView';
import { PayrollView } from './components/PayrollView';
import { SmartInsightsBanner } from './components/SmartInsightsBanner';
import { Employee } from './types';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<string>('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState<'profile' | 'salary' | 'attendance'>('profile');

  const handleOpenDrawer = (emp: Employee, tab: 'profile' | 'salary' | 'attendance' = 'profile') => {
    setSelectedEmployee(emp);
    setDrawerInitialTab(tab);
  };

  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Glass Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'employees' && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SmartInsightsBanner />
              <EmployeeKanban onSelectEmployee={handleOpenDrawer} />
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AttendanceView />
            </motion.div>
          )}

          {activeTab === 'timeoff' && (
            <motion.div
              key="timeoff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LeaveApprovalQueue />
            </motion.div>
          )}

          {activeTab === 'payroll' && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PayrollView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Slide-over Profile and Salary Drawer */}
      {selectedEmployee && (
        <ProfileDrawer
          employee={selectedEmployee}
          onClose={handleCloseDrawer}
          initialTab={drawerInitialTab}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
