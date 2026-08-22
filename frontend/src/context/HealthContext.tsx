import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface SystemHealthData {
  status: string;
  environment: string;
  timestamp: string;
  uptime: number;
}

interface HealthContextType {
  isConnected: boolean;
  isChecking: boolean;
  healthInfo: SystemHealthData | null;
  checkHealth: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType>({
  isConnected: false,
  isChecking: false,
  healthInfo: null,
  checkHealth: async () => {},
});

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [healthInfo, setHealthInfo] = useState<SystemHealthData | null>(null);

  const performCheck = async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      let res = await fetch('http://localhost:5001/api/v1/health', { signal: controller.signal }).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('http://localhost:5000/api/v1/health', { signal: controller.signal }).catch(() => null);
      }
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        setIsConnected(true);
        setHealthInfo(json?.data || { status: 'UP', environment: 'development', timestamp: new Date().toISOString(), uptime: 100 });
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

export const useHealth = () => useContext(HealthContext);
