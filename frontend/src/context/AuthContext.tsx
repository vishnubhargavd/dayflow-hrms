import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User;
  switchRole: (role: Role) => void;
  token: string | null;
}

const DEFAULT_USERS: Record<Role, User> = {
  ADMIN: {
    id: 'user-admin-1',
    loginId: 'OIADMN20220000',
    email: 'admin@dayflow.com',
    role: 'ADMIN',
    employeeId: 'emp-5',
  },
  HR: {
    id: 'user-hr-1',
    loginId: 'OIHRMG20230001',
    email: 'hr@dayflow.com',
    role: 'HR',
    employeeId: 'emp-2',
  },
  EMPLOYEE: {
    id: 'user-emp-1',
    loginId: 'OIJODO20220001',
    email: 'john.doe@dayflow.com',
    role: 'EMPLOYEE',
    employeeId: 'emp-1',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USERS.ADMIN,
  switchRole: () => {},
  token: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('ADMIN');
  const [user, setUser] = useState<User>(DEFAULT_USERS.ADMIN);
  const [token, setToken] = useState<string | null>('mock-jwt-token');

  useEffect(() => {
    setUser(DEFAULT_USERS[currentRole]);
  }, [currentRole]);

  const switchRole = (role: Role) => {
    setCurrentRole(role);
    setUser(DEFAULT_USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
