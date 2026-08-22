import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { EmployeeKanban } from './components/EmployeeKanban';
import { ProfileFormView } from './components/ProfileFormView';
import { AttendancePage } from './components/AttendancePage';
import { TimeOffPage } from './components/TimeOffPage';
import { CreateEmployeeModal } from './components/CreateEmployeeModal';
import { Employee } from './types';
import { api, INITIAL_EMPLOYEES } from './services/api';

function DashboardContent() {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('employees');
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    api.getEmployees().then((data) => setEmployees(data || INITIAL_EMPLOYEES));
  }, []);

  const handleSelectEmployee = (emp: any) => {
    // Find full matching employee or use selected
    const found = employees.find((e) => e.id === emp.id || e.loginId === emp.loginId) || emp;
    setSelectedEmployee(found);
  };

  const handleOpenMyProfile = () => {
    const myEmp = employees.find((e) => e.loginId === user.loginId || e.id === user.employeeId) || employees[0];
    setSelectedEmployee(myEmp);
    setActiveTab('employees');
  };

  const handleEmployeeCreated = (newEmp: Employee) => {
    setEmployees([newEmp, ...employees]);
  };

  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Global Navigation Bar & Systray */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedEmployee(null);
        }}
        onOpenMyProfile={handleOpenMyProfile}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'employees' && (
            <motion.div
              key={selectedEmployee ? 'profile-view' : 'kanban-view'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {selectedEmployee ? (
                <ProfileFormView
                  employee={selectedEmployee}
                  onBack={() => setSelectedEmployee(null)}
                />
              ) : (
                <EmployeeKanban
                  employees={employees}
                  onSelectEmployee={handleSelectEmployee}
                  onOpenCreateModal={() => setIsCreateModalOpen(true)}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <AttendancePage />
            </motion.div>
          )}

          {activeTab === 'timeoff' && (
            <motion.div
              key="timeoff"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <TimeOffPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Employee Modal for Admin / HR */}
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEmployeeCreated={handleEmployeeCreated}
      />
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
