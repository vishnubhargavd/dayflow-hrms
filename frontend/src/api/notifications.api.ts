import { apiRequest } from './client';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchMyNotifications(): Promise<{ items: NotificationItem[]; unreadCount: number }> {
  try {
    const res = await apiRequest<{ items: NotificationItem[]; total: number }>('/notifications/me');
    const countRes = await apiRequest<{ count: number }>('/notifications/me/unread-count');
    return {
      items: res.data?.items || [],
      unreadCount: countRes.data?.count || 0,
    };
  } catch {
    return { items: [], unreadCount: 0 };
  }
}
