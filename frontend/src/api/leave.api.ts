import { apiRequest } from './client';

export interface LeaveBalanceItem {
  id: string;
  leaveTypeId: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  leaveType: {
    name: string;
    code: string;
  };
}

export async function fetchMyLeaveBalances(): Promise<LeaveBalanceItem[]> {
  try {
    const res = await apiRequest<LeaveBalanceItem[]>('/leave/me/balances');
    return res.data || [];
  } catch {
    return [];
  }
}
