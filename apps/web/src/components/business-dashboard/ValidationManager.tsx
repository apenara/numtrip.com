'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Clock, 
  Filter, 
  Mail, 
  MessageCircle,
  MessageSquare,
  Phone,
  RefreshCw,
  Reply,
  ThumbsDown,
  ThumbsUp,
  User
} from 'lucide-react';

interface Validation {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'ADDRESS' | 'HOURS';
  isCorrect: boolean;
  comment?: string;
  createdAt: Date;
  businessResponse?: string;
  respondedAt?: Date;
}

export function ValidationManager() {
  const { user } = useAuthStore();
  const [validations, setValidations] = useState<Validation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'unresponded'>('all');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [businessId] = useState('cmf7ofthb0000c15cqexub8yc'); // Mock ID

  useEffect(() => {
    const fetchValidations = async () => {
      try {
        // Mock data for demonstration
        const mockValidations: Validation[] = [
          {
            id: '1',
            type: 'PHONE',
            isCorrect: false,
            comment: 'This phone number is not working. I tried calling multiple times and it goes straight to voicemail.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
          {
            id: '2', 
            type: 'EMAIL',
            isCorrect: true,
            comment: 'Email response was very fast and helpful for my booking inquiry.',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            businessResponse: 'Thank you for your positive feedback! We always try to respond quickly to help our guests.',
            respondedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          },
          {
            id: '3',
            type: 'ADDRESS',
            isCorrect: false,
            comment: 'The address shown is incorrect. The hotel is actually located on Calle 2, not Calle 1.',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          },
          {
            id: '4',
            type: 'WHATSAPP',
            isCorrect: true,
            comment: 'WhatsApp number works perfectly and staff was very responsive.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          },
          {
            id: '5',
            type: 'HOURS',
            isCorrect: false,
            comment: 'Arrived at 8 PM and they were already closed, but website says open until 10 PM.',
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          },
        ];

        setValidations(mockValidations);
      } catch (error) {
        console.error('Failed to fetch validations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchValidations();
  }, [businessId]);

  const handleResponse = async (validationId: string) => {
    if (!responseText.trim()) return;

    try {
      // In production: API call to respond to validation
      // const response = await fetch(`/api/v1/business-dashboard/${businessId}/validations/respond`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      //   body: JSON.stringify({ validationId, response: responseText })
      // });

      // Mock update for demo
      setValidations(validations.map(validation => 
        validation.id === validationId
          ? { 
              ...validation, 
              businessResponse: responseText,
              respondedAt: new Date() 
            }
          : validation
      ));

      setRespondingTo(null);
      setResponseText('');
    } catch (error) {
      console.error('Failed to respond to validation:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHONE':
        return <Phone className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'WHATSAPP':
        return <MessageCircle className="h-4 w-4" />;
      case 'ADDRESS':
        return <User className="h-4 w-4" />;
      case 'HOURS':
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredValidations = validations.filter(validation => {
    switch (filter) {
      case 'positive':
        return validation.isCorrect;
      case 'negative':
        return !validation.isCorrect;
      case 'unresponded':
        return !validation.businessResponse;
      default:
        return true;
    }
  });

  const stats = {
    total: validations.length,
    positive: validations.filter(v => v.isCorrect).length,
    negative: validations.filter(v => !v.isCorrect).length,
    unresponded: validations.filter(v => !v.businessResponse).length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
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
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Validations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Positive</p>
              <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Negative</p>
              <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
            </div>
            <ThumbsDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Need Response</p>
              <p className="text-2xl font-bold text-orange-600">{stats.unresponded}</p>
            </div>
            <Reply className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Validations</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
              <option value="unresponded">Need Response</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Validations List */}
      <div className="space-y-4">
        {filteredValidations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No validations yet' : `No ${filter} validations`}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Customer validations will appear here when they verify your contact information.' 
                : `Try changing the filter to see other validations.`
              }
            </p>
          </div>
        ) : (
          filteredValidations.map((validation) => (
            <div key={validation.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    validation.isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTypeIcon(validation.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {validation.type.toLowerCase()} validation
                      </span>
                      {validation.isCorrect ? (
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(validation.createdAt)}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  validation.businessResponse
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {validation.businessResponse ? 'Responded' : 'Needs Response'}
                </span>
              </div>

              {/* Customer Comment */}
              {validation.comment && (
                <div className="mb-4">
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                    "{validation.comment}"
                  </p>
                </div>
              )}

              {/* Business Response */}
              {validation.businessResponse ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Reply className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Your Response</span>
                    <span className="text-xs text-blue-600 ml-2">
                      {validation.respondedAt && formatTimeAgo(validation.respondedAt)}
                    </span>
                  </div>
                  <p className="text-blue-800">{validation.businessResponse}</p>
                </div>
              ) : (
                <div className="mt-4">
                  {respondingTo === validation.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Write your response to this validation..."
                      />
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleResponse(validation.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingTo(validation.id)}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Respond to Customer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}