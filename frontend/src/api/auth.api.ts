import { apiRequest, setAuthToken, clearAuthToken } from './client';

export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface UserEmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  personalEmail?: string;
  profilePicture?: string;
  department?: { id?: string; name?: string; code?: string };
  designation?: { id?: string; title?: string };
}

export interface UserAccount {
  id: string;
  loginId: string;
  email: string;
  role: UserRole;
  accountStatus: string;
  requiresPasswordChange: boolean;
  employee?: UserEmployeeProfile;
}

export interface LoginResponseData {
  token: string;
  user: UserAccount;
}

export async function loginUser(loginIdOrEmail: string, password: string): Promise<LoginResponseData> {
  const res = await apiRequest<LoginResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ loginIdOrEmail, password }),
  });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data!;
}

export async function registerUser(fullName: string, email: string, password: string): Promise<LoginResponseData> {
  const res = await apiRequest<LoginResponseData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data!;
}

export async function getCurrentUser(): Promise<UserAccount> {
  const res = await apiRequest<UserAccount>('/auth/me');
  return res.data!;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const res = await apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.data!;
}

export function logoutUser() {
  clearAuthToken();
}
