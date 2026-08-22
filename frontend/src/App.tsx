import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MainDashboard } from './components/MainDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { EmployeeTimeOffView } from './components/EmployeeTimeOffView';
import { EmployeeKanban } from './components/EmployeeKanban';
import { ProfileDrawer } from './components/ProfileDrawer';
import { LeaveApprovalQueue } from './components/LeaveApprovalQueue';
import { AttendanceView } from './components/AttendanceView';
import { PayrollView } from './components/PayrollView';
import { ApprovalsView } from './components/ApprovalsView';
import { ReportsAnalyticsView } from './components/ReportsAnalyticsView';
import { DocumentsView } from './components/DocumentsView';
import { SettingsView } from './components/SettingsView';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { PayslipModal } from './components/PayslipModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SmartInsightsBanner } from './components/SmartInsightsBanner';
import { Employee } from './types';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { employees, addEmployee, updateEmployee } = useData();
  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState<'profile' | 'salary' | 'attendance'>('profile');

  // Modals state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Reset tab to dashboard on role change / login
  useEffect(() => {
    setActiveTab('dashboard');
  }, [user.role, isAuthenticated]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If not logged in, show full-page Login screen in the beginning
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenDrawer = (emp: Employee, tab: 'profile' | 'salary' | 'attendance' = 'profile') => {
    setSelectedEmployee(emp);
    setDrawerInitialTab(tab);
  };

  const handleCloseDrawer = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Fixed Left Vertical Sidebar with Least Privilege Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Application Bar */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
          onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
        />

        {/* Dynamic Workspace View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {/* 1. Dashboard Tab (Separate HR vs Employee views) */}
            {activeTab === 'dashboard' && (
              <motion.div
                key={`dashboard-${user.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isHRorAdmin ? (
                  <MainDashboard
                    onNavigateTab={setActiveTab}
                    onSelectEmployee={handleOpenDrawer}
                    onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
                  />
                ) : (
                  <EmployeeDashboard
                    onNavigateTab={setActiveTab}
                    onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
                    onOpenPayslip={() => setIsPayslipOpen(true)}
                  />
                )}
              </motion.div>
            )}

            {/* 2. Employee Profile Tab (Employee Only) */}
            {!isHRorAdmin && activeTab === 'myprofile' && (
              <motion.div
                key="myprofile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <EmployeeProfileView />
              </motion.div>
            )}

            {/* 3. Employees Directory Tab (HR Admin Only) */}
            {isHRorAdmin && activeTab === 'employees' && (
              <motion.div
                key="employees"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SmartInsightsBanner />
                <EmployeeKanban
                  onSelectEmployee={handleOpenDrawer}
                  onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
                />
              </motion.div>
            )}

            {/* 4. Attendance Tab */}
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

            {/* 5. Leave & Time Off Tab (Employee View matching screenshot vs HR Leave List) */}
            {activeTab === 'timeoff' && (
              <motion.div
                key="timeoff"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!isHRorAdmin ? (
                  <EmployeeTimeOffView
                    onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
                  />
                ) : (
                  <LeaveApprovalQueue />
                )}
              </motion.div>
            )}

            {/* 6. Payroll Tab (Employee Read-Only vs Admin Controls) */}
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

            {/* 7. Approvals Queue (HR Admin Only) */}
            {isHRorAdmin && activeTab === 'approvals' && (
              <motion.div
                key="approvals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ApprovalsView />
              </motion.div>
            )}

            {/* 8. Reports & Analytics (HR Admin Only) */}
            {isHRorAdmin && activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ReportsAnalyticsView />
              </motion.div>
            )}

            {/* 9. Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DocumentsView />
              </motion.div>
            )}

            {/* 10. Settings Tab (HR Admin Only) */}
            {isHRorAdmin && activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Slide-over Profile and Salary Drawer (For HR Employee Inspector) */}
      {selectedEmployee && (
        <ProfileDrawer
          employee={selectedEmployee}
          onClose={handleCloseDrawer}
          onUpdateEmployee={updateEmployee}
          initialTab={drawerInitialTab}
        />
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={addEmployee}
      />

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
      />

      {/* Payslip Modal for Employee Quick View */}
      <PayslipModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        employeeName={user.name}
        employeeId={user.loginId}
        department={user.departmentName}
        designation={user.designationTitle}
        wage={65000}
        month="August 2026"
      />

      {/* Global Search Palette (⌘K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        employees={employees}
        onSelectEmployee={(emp) => handleOpenDrawer(emp, 'profile')}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
