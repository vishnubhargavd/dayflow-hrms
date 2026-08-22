import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { useToast } from '../context/ToastContext';
import {
  fetchEmployeeDashboard,
  fetchHrDashboard,
  fetchAdminDashboard,
  type EmployeeDashboardData,
  type HrDashboardData,
  type AdminDashboardData,
} from '../features/dashboard/dashboard.api';
import { DashboardSkeleton } from '../features/dashboard/components/DashboardSkeleton';
import { DashboardErrorState } from '../features/dashboard/components/DashboardErrorState';
import { EmployeeDashboard } from '../features/dashboard/employee/EmployeeDashboard';
import { HrDashboard } from '../features/dashboard/hr/HrDashboard';
import { AdminDashboard } from '../features/dashboard/admin/AdminDashboard';

interface DashboardViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { user, role } = useAuth();
  const { isConnected, isChecking } = useHealth();
  const { showToast } = useToast();

  const [empData, setEmpData] = useState<EmployeeDashboardData | null>(null);
  const [hrData, setHrData] = useState<HrDashboardData | null>(null);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userName = user?.employee
    ? `${user.employee.firstName}`.toUpperCase()
    : user?.email.split('@')[0].toUpperCase() || 'USER';

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (role === 'EMPLOYEE') {
        const data = await fetchEmployeeDashboard();
        setEmpData(data);
      } else if (role === 'HR') {
        const data = await fetchHrDashboard();
        setHrData(data);
      } else {
        const data = await fetchAdminDashboard();
        setAdminData(data);
      }
    } catch (err: any) {
      setError(err.message || 'We couldn\'t load your workspace dashboard right now.');
      showToast('Failed to load dashboard metrics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [role]);

  if (isLoading) {
    return <DashboardSkeleton role={role} />;
  }

  if (error) {
    return <DashboardErrorState error={error} onRetry={loadDashboard} />;
  }

  if (role === 'EMPLOYEE' && empData) {
    return (
      <EmployeeDashboard
        data={empData}
        userName={userName}
        isConnected={isConnected}
        isChecking={isChecking}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  if (role === 'HR' && hrData) {
    return <HrDashboard data={hrData} onNavigateTab={onNavigateTab} />;
  }

  if (role === 'ADMIN' && adminData) {
    return <AdminDashboard data={adminData} />;
  }

  return <DashboardErrorState error="No dashboard configuration found for your role" onRetry={loadDashboard} />;
};
