import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

export interface UserProfile extends User {
  name: string;
  avatar: string;
  designationTitle: string;
  departmentName: string;
}

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (role: Role, email?: string, name?: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  token: string | null;
}

export const DEMO_PROFILES: Record<Role, UserProfile> = {
  ADMIN: {
    id: 'user-admin-1',
    loginId: 'OIADMN20220000',
    name: 'Ameer Admin',
    email: 'admin@dayflow.com',
    role: 'ADMIN',
    employeeId: 'emp-5',
    designationTitle: 'Principal Architect & HR Director',
    departmentName: 'Executive Leadership',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  HR: {
    id: 'user-hr-1',
    loginId: 'OIHRMG20230001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@dayflow.com',
    role: 'HR',
    employeeId: 'emp-2',
    designationTitle: 'Human Resources Officer',
    departmentName: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  EMPLOYEE: {
    id: 'user-emp-1',
    loginId: 'OIPRSH20240004',
    name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.com',
    role: 'EMPLOYEE',
    employeeId: 'emp-4',
    designationTitle: 'Fullstack Software Engineer',
    departmentName: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PROFILES.HR,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
  token: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dayflow_auth') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem('dayflow_role') as Role) || 'HR';
  });

  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES[currentRole]);
  const [token, setToken] = useState<string | null>('dayflow-mock-jwt-session');

  useEffect(() => {
    const profile = DEMO_PROFILES[currentRole] || DEMO_PROFILES.HR;
    setUser(profile);
  }, [currentRole]);

  const login = (role: Role, email?: string, name?: string) => {
    const base = DEMO_PROFILES[role] || DEMO_PROFILES.EMPLOYEE;
    const customUser = {
      ...base,
      email: email || base.email,
      name: name || base.name,
      role,
    };
    setCurrentRole(role);
    setUser(customUser);
    setIsAuthenticated(true);
    localStorage.setItem('dayflow_auth', 'true');
    localStorage.setItem('dayflow_role', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dayflow_auth');
    localStorage.removeItem('dayflow_role');
  };

  const switchRole = (role: Role) => {
    setCurrentRole(role);
    setUser(DEMO_PROFILES[role] || DEMO_PROFILES.HR);
    setIsAuthenticated(true);
    localStorage.setItem('dayflow_auth', 'true');
    localStorage.setItem('dayflow_role', role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
