'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Tag, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'validation' | 'promo_code' | 'metrics' | 'system' | 'warning';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'validation' | 'promo_code' | 'metrics'>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Mock notifications for demonstration
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'validation',
            title: 'New Negative Validation',
            message: 'A customer reported that your phone number is not working. Please check and update if necessary.',
            createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
            read: false,
            priority: 'high',
            actionUrl: '/dashboard/business/validations'
          },
          {
            id: '2',
            type: 'promo_code',
            title: 'Promo Code Expiring Soon',
            message: 'Your promo code "VERANO2024" will expire in 7 days. Consider extending or creating a new one.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            read: false,
            priority: 'medium',
            actionUrl: '/dashboard/business/promo-codes'
          },
          {
            id: '3',
            type: 'metrics',
            title: 'Monthly Performance Report',
            message: 'Your business profile had 387 views this month, up 24% from last month. Great job!',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            read: true,
            priority: 'low',
          },
          {
            id: '4',
            type: 'validation',
            title: 'Positive Validation Received',
            message: 'A customer validated your email address as working correctly. Your trust score improved!',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            read: true,
            priority: 'low',
          },
          {
            id: '5',
            type: 'system',
            title: 'Profile Optimization Tip',
            message: 'Add a business description to improve your search ranking and attract more customers.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            read: false,
            priority: 'medium',
            actionUrl: '/dashboard/business/profile'
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return <MessageSquare className="h-5 w-5" />;
      case 'promo_code':
        return <Tag className="h-5 w-5" />;
      case 'metrics':
        return <TrendingUp className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600 bg-red-100';
    if (priority === 'medium') return 'text-orange-600 bg-orange-100';
    
    switch (type) {
      case 'validation':
        return 'text-purple-600 bg-purple-100';
      case 'promo_code':
        return 'text-blue-600 bg-blue-100';
      case 'metrics':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'validation':
      case 'promo_code':
      case 'metrics':
        return notif.type === filter;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-900">
            All Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="validation">Validations</option>
          <option value="promo_code">Promo Codes</option>
          <option value="metrics">Metrics</option>
        </select>
      </div>

      {/* Notification Settings Panel */}
      {showSettings && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <button className="bg-blue-600 rounded-full w-10 h-6 flex items-center justify-end px-1">
                <div className="bg-white w-4 h-4 rounded-full"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Get browser notifications</p>
              </div>
              <button className="bg-gray-300 rounded-full w-10 h-6 flex items-center justify-start px-1">
                <div className="bg-white w-4 h-4 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You're all caught up! New notifications will appear here." 
                : `Try changing the filter to see other notifications.`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white border rounded-lg p-6 ${
                notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type, notification.priority)}`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                      {notification.priority === 'high' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      View
                    </a>
                  )}
                  {!notification.read ? (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-500 hover:text-blue-600"
                      title="Mark as read"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="p-2 text-gray-400"
                      title="Read"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}