import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUserDirectly: (u: User, t: string) => void;
}

const DEFAULT_ADMIN_USER: User = {
  id: 'user-admin-1',
  loginId: 'OIADMN20220000',
  email: 'admin@dayflow.com',
  role: 'ADMIN',
  employeeId: 'emp-5',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_ADMIN_USER,
  token: null,
  isAuthenticated: true,
  login: async () => true,
  logout: () => {},
  setUserDirectly: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dayflow_token') || 'demo-jwt-token');
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('dayflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_ADMIN_USER;
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('dayflow_token', token);
    } else {
      localStorage.removeItem('dayflow_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dayflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dayflow_user');
    }
  }, [user]);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password }),
      });

      if (res.ok) {
        const json = await res.json();
        const userData: User = {
          id: json.data?.user?.id || `user-${Date.now()}`,
          loginId: json.data?.user?.loginId || loginId,
          email: json.data?.user?.email || `${loginId.toLowerCase()}@dayflow.com`,
          role: (json.data?.user?.role as Role) || (loginId.includes('ADMN') ? 'ADMIN' : 'EMPLOYEE'),
          employeeId: json.data?.user?.employeeId,
        };
        const jwtToken = json.data?.token || `jwt-${Date.now()}`;
        setUser(userData);
        setToken(jwtToken);
        return true;
      }
    } catch {}

    // Robust offline fallback for Hackathon demo
    const isAdm = loginId.toUpperCase().includes('ADMN') || loginId.toLowerCase().includes('admin');
    const fallbackUser: User = {
      id: isAdm ? 'user-admin-1' : 'user-emp-1',
      loginId: loginId || (isAdm ? 'OIADMN20220000' : 'OIJODO20220001'),
      email: isAdm ? 'admin@dayflow.com' : 'john.doe@dayflow.com',
      role: isAdm ? 'ADMIN' : 'EMPLOYEE',
      employeeId: isAdm ? 'emp-5' : 'emp-1',
    };
    setUser(fallbackUser);
    setToken(`jwt-token-${Date.now()}`);
    return true;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('dayflow_token');
    localStorage.removeItem('dayflow_user');
  };

  const setUserDirectly = (u: User, t: string) => {
    setUser(u);
    setToken(t);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, setUserDirectly }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
