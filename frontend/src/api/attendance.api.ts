import { apiRequest } from './client';

export interface TodayAttendanceData {
  status: string;
  checkIn?: string;
  checkOut?: string;
  workDurationMinutes?: number;
}

export interface AttendanceOverviewData {
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
}

export async function fetchTodayAttendance(): Promise<TodayAttendanceData | null> {
  try {
    const res = await apiRequest<TodayAttendanceData>('/attendance/today');
    return res.data || null;
  } catch {
    return null;
  }
}

export async function fetchAttendanceOverview(): Promise<AttendanceOverviewData | null> {
  try {
    const res = await apiRequest<AttendanceOverviewData>('/attendance/analytics/overview');
    return res.data || null;
  } catch {
    return null;
  }
}
