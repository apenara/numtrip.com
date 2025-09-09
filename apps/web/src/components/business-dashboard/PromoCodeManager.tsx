'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  AlertCircle, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Copy, 
  Edit2,
  Eye,
  EyeOff,
  Percent,
  Plus,
  Trash2,
  Users
} from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount: number;
  validUntil: Date;
  active: boolean;
  timesUsed?: number;
  maxUses?: number;
  createdAt: Date;
}

export function PromoCodeManager() {
  const { user } = useAuthStore();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [businessId] = useState('cmf7ofthb0000c15cqexub8yc'); // Mock ID

  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        // Mock data for demonstration
        const mockPromoCodes: PromoCode[] = [
          {
            id: '1',
            code: 'DESCUENTO20',
            description: '20% discount for new customers',
            discount: 20,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            active: true,
            timesUsed: 12,
            maxUses: 100,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          },
          {
            id: '2',
            code: 'VERANO2024',
            description: 'Summer special - 15% off',
            discount: 15,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now  
            active: true,
            timesUsed: 5,
            maxUses: 50,
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
          },
          {
            id: '3',
            code: 'WELCOME10',
            description: 'Welcome discount for first-time visitors',
            discount: 10,
            validUntil: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
            active: false,
            timesUsed: 23,
            maxUses: 25,
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          },
        ];

        setPromoCodes(mockPromoCodes);
      } catch (error) {
        console.error('Failed to fetch promo codes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodes();
  }, [businessId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast notification
  };

  const toggleCodeStatus = async (codeId: string) => {
    setPromoCodes(codes => 
      codes.map(code => 
        code.id === codeId ? { ...code, active: !code.active } : code
      )
    );
  };

  const deleteCode = async (codeId: string) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      setPromoCodes(codes => codes.filter(code => code.id !== codeId));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isExpired = (date: Date) => date < new Date();
  const isExpiringSoon = (date: Date) => {
    const daysUntilExpiry = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Codes</p>
              <p className="text-2xl font-bold text-gray-900">{promoCodes.length}</p>
            </div>
            <Percent className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Codes</p>
              <p className="text-2xl font-bold text-green-600">
                {promoCodes.filter(code => code.active && !isExpired(code.validUntil)).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-600">
                {promoCodes.reduce((sum, code) => sum + (code.timesUsed || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">
                {promoCodes.filter(code => isExpiringSoon(code.validUntil)).length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Create New Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Manage Promo Codes</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Code
        </button>
      </div>

      {/* Promo Codes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {promoCodes.map((promoCode) => {
          const expired = isExpired(promoCode.validUntil);
          const expiringSoon = isExpiringSoon(promoCode.validUntil);
          const usagePercent = promoCode.maxUses 
            ? ((promoCode.timesUsed || 0) / promoCode.maxUses) * 100 
            : 0;

          return (
            <div key={promoCode.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  expired 
                    ? 'bg-red-100 text-red-800'
                    : expiringSoon
                      ? 'bg-orange-100 text-orange-800'
                      : promoCode.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                  {expired ? 'Expired' : expiringSoon ? 'Expiring Soon' : promoCode.active ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCodeStatus(promoCode.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title={promoCode.active ? 'Deactivate' : 'Activate'}
                  >
                    {promoCode.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditingCode(promoCode)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCode(promoCode.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Code and Copy Button */}
              <div className="mb-4">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {promoCode.code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(promoCode.code)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description and Discount */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">{promoCode.description}</p>
                <p className="text-2xl font-bold text-blue-600">{promoCode.discount}% OFF</p>
              </div>

              {/* Usage Stats */}
              {promoCode.maxUses && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Usage</span>
                    <span>{promoCode.timesUsed}/{promoCode.maxUses}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Expiry Date */}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Expires: {formatDate(promoCode.validUntil)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {promoCodes.length === 0 && (
        <div className="text-center py-12">
          <Percent className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No promo codes yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first promo code to start attracting more customers.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Code
          </button>
        </div>
      )}

      {/* Create/Edit Form Modal would go here */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Promo Code
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                Promo code creation form will be implemented in the next iteration. 
                For now, this shows the UI layout and existing codes management.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}