'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, 
  MousePointer, 
  MessageSquare, 
  Tag,
  Clock,
  User 
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'view' | 'click' | 'validation' | 'promo_used';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  businessId: string;
}

export function RecentActivity({ businessId }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // For demo purposes, using mock data
        // In production: fetch(`/api/v1/business-dashboard/${businessId}/activity`)
        
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'validation',
            description: 'Positive validation for phone number',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
            metadata: { type: 'PHONE', isCorrect: true }
          },
          {
            id: '2', 
            type: 'view',
            description: 'Profile viewed by visitor',
            timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          },
          {
            id: '3',
            type: 'click',
            description: 'WhatsApp number clicked',
            timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
          },
          {
            id: '4',
            type: 'promo_used',
            description: 'Promo code DESCUENTO20 used',
            timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
          },
          {
            id: '5',
            type: 'validation',
            description: 'Negative validation for email',
            timestamp: new Date(Date.now() - 180 * 60 * 1000), // 3 hours ago
            metadata: { type: 'EMAIL', isCorrect: false, comment: 'Email bounced back' }
          },
        ];

        setActivities(mockActivities);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [businessId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'click':
        return <MousePointer className="h-4 w-4 text-green-500" />;
      case 'validation':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'promo_used':
        return <Tag className="h-4 w-4 text-orange-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
                {activity.metadata?.comment && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    "{activity.metadata.comment}"
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                {activity.type === 'validation' && activity.metadata && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    activity.metadata.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {activity.metadata.isCorrect ? 'Positive' : 'Negative'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Activity updates every few minutes
        </div>
      </div>
    </div>
  );
}