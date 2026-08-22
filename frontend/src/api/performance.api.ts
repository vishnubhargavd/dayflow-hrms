import { apiRequest } from './client';

export interface PerformanceGoal {
  id: string;
  title: string;
  category: string;
  progressPercentage: number;
  dueDate: string;
  status: string;
}

export async function fetchPerformanceGoals(): Promise<PerformanceGoal[]> {
  try {
    const res = await apiRequest<{ items: PerformanceGoal[] }>('/performance/goals');
    return res.data?.items || [];
  } catch {
    return [];
  }
}
