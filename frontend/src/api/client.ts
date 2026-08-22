export const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('dayflow_auth_token') || sessionStorage.getItem('dayflow_auth_token');
};

export const setAuthToken = (token: string, remember: boolean = true) => {
  if (remember) {
    localStorage.setItem('dayflow_auth_token', token);
  } else {
    sessionStorage.setItem('dayflow_auth_token', token);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('dayflow_auth_token');
  sessionStorage.removeItem('dayflow_auth_token');
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken();
      }
      throw new ApiError(
        data.message || data.error || `HTTP error ${response.status}`,
        response.status,
        data.code
      );
    }

    return data;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Backend service connection failed', 0, 'NETWORK_ERROR');
  }
}
