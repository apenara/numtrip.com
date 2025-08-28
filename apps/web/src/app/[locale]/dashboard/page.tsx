'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Building, Phone, Mail, MessageCircle, Plus, Edit, Trash2, BarChart3, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's businesses from API
    setLoading(false);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Link href="/business/create" className="btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Business
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary-blue" />
                </div>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-sm text-gray-600">Active Businesses</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">This month</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-sm text-gray-600">Validations</p>
            </div>
          </div>

          {/* Businesses List */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Businesses</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
              </div>
            ) : businesses.length === 0 ? (
              <div className="p-12 text-center">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses yet</h3>
                <p className="text-gray-600 mb-6">
                  Add your first business to start receiving verified contacts
                </p>
                <Link href="/business/create" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Business
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {businesses.map((business) => (
                  <div key={business.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                          {business.verified && (
                            <span className="badge badge-verified">✓ Verified</span>
                          )}
                          <span className="badge badge-hotel">{business.category}</span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          {business.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{business.phone}</span>
                            </div>
                          )}
                          {business.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{business.email}</span>
                            </div>
                          )}
                          {business.whatsapp && (
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4" />
                              <span>{business.whatsapp}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-6 mt-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{business.views || 0} views</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{business.validations || 0} validations</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/business/${business.id}/edit`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/business/${business.id}/stats`}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}