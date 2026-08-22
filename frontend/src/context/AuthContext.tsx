import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser, type UserAccount, type UserRole } from '../api/auth.api';
import { getAuthToken } from '../api/client';

export type AuthStateStatus = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

interface AuthContextType {
  user: UserAccount | null;
  role: UserRole;
  status: AuthStateStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginIdOrEmail: string, pass: string) => Promise<UserAccount>;
  register: (fullName: string, email: string, pass: string) => Promise<UserAccount>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [status, setStatus] = useState<AuthStateStatus>('INITIALIZING');

  const syncAuthSession = async () => {
    setStatus('INITIALIZING');
    const token = getAuthToken();
    if (token) {
      try {
        const authUser = await getCurrentUser();
        if (authUser && authUser.id) {
          setUser(authUser);
          setStatus('AUTHENTICATED');
          return;
        }
      } catch {
        // Token expired or invalid
        logoutUser();
      }
    }
    setUser(null);
    setStatus('UNAUTHENTICATED');
  };

  useEffect(() => {
    syncAuthSession();
  }, []);

  const handleLogin = async (loginIdOrEmail: string, pass: string): Promise<UserAccount> => {
    const res = await loginUser(loginIdOrEmail, pass);
    if (res && res.user) {
      setUser(res.user);
      setStatus('AUTHENTICATED');
      return res.user;
    }
    throw new Error('Invalid login response payload');
  };

  const handleRegister = async (fullName: string, email: string, pass: string): Promise<UserAccount> => {
    const res = await registerUser(fullName, email, pass);
    if (res && res.user) {
      setUser(res.user);
      setStatus('AUTHENTICATED');
      return res.user;
    }
    throw new Error('Invalid registration response payload');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setStatus('UNAUTHENTICATED');
  };

  const role: UserRole = user?.role || 'EMPLOYEE';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        status,
        isAuthenticated: status === 'AUTHENTICATED' && !!user,
        isLoading: status === 'INITIALIZING',
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
