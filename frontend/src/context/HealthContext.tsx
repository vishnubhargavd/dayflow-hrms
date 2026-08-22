import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { checkSystemHealth, type SystemHealthData } from '../api/health.api';

interface HealthContextType {
  isConnected: boolean;
  isChecking: boolean;
  healthInfo: SystemHealthData | null;
  checkHealth: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [healthInfo, setHealthInfo] = useState<SystemHealthData | null>(null);

  const performCheck = async () => {
    setIsChecking(true);
    try {
      const data = await checkSystemHealth();
      if (data && (data.status === 'OK' || data.status === 'UP')) {
        setIsConnected(true);
        setHealthInfo(data);
      } else {
        setIsConnected(false);
        setHealthInfo(null);
      }
    } catch {
      setIsConnected(false);
      setHealthInfo(null);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    performCheck();
    const interval = setInterval(performCheck, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <HealthContext.Provider
      value={{
        isConnected,
        isChecking,
        healthInfo,
        checkHealth: performCheck,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
