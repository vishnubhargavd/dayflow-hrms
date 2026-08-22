import React, { useState, useEffect } from 'react';
import { fetchMyNotifications, type NotificationItem } from '../api/notifications.api';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Bell, CheckCheck, Sparkles } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMyNotifications();
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'PATCH' });
      showToast('All notifications marked as read', 'success');
      loadNotifications();
    } catch (err: any) {
      showToast(err.message || 'Failed to mark notifications as read', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>System Notifications & Signals</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Real-time organizational signals, leave approval alerts, and system notices.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#131A15',
              border: '1px solid rgba(124, 255, 178, 0.3)',
              color: '#7CFFB2',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List Container */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: '1.5rem' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#8A918A' }}>Loading notification signals...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#8A918A' }}>
            <Bell size={36} color="#7CFFB2" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#F3F1E8', fontWeight: 800, margin: 0 }}>NO UNREAD SIGNALS OR NOTIFICATIONS</h4>
            <p style={{ fontSize: '0.8125rem', marginTop: '6px' }}>System activity and automated notices will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  background: n.isRead ? '#131A15' : 'rgba(124, 255, 178, 0.04)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: n.isRead ? '1px solid rgba(243, 241, 232, 0.08)' : '1px solid rgba(124, 255, 178, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Sparkles size={18} color={n.isRead ? '#8A918A' : '#7CFFB2'} />
                  <div>
                    <h5 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>{n.title}</h5>
                    <p style={{ fontSize: '0.8125rem', color: '#A8ADA4', margin: '4px 0 0 0' }}>{n.message}</p>
                  </div>
                </div>
                <Badge variant={n.isRead ? 'success' : 'brand'}>{n.isRead ? 'Read' : 'New Signal'}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
