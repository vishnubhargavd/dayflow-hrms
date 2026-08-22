import { apiRequest } from './client';

export interface SystemHealthData {
  status: string;
  environment: string;
  timestamp: string;
  uptime: number;
}

export async function checkSystemHealth(): Promise<SystemHealthData> {
  const res = await apiRequest<SystemHealthData>('/health');
  return res.data || { status: 'UNKNOWN', environment: 'development', timestamp: new Date().toISOString(), uptime: 0 };
}
