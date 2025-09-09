'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { DashboardCard } from '@/components/business-dashboard/DashboardCard';
import { MetricChart } from '@/components/business-dashboard/MetricChart';
import { RecentActivity } from '@/components/business-dashboard/RecentActivity';
import { QuickActions } from '@/components/business-dashboard/QuickActions';
import { 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  MessageSquare, 
  MousePointer,
  Shield,
  Tag,
  TrendingUp
} from 'lucide-react';

interface BusinessMetrics {
  profileViews: number;
  contactClicks: number;
  validationCount: number;
  trustScore: number;
  promoCodeUsage: number;
  viewsThisMonth: number;
  viewsLastMonth: number;
  clicksThisMonth: number;
  clicksLastMonth: number;
  positiveValidations: number;
  negativeValidations: number;
  validationResponseRate: number;
}

interface BusinessOverviewData {
  metrics: BusinessMetrics;
  businessName: string;
  businessCategory: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  actionItems: string[];
  unreadValidations: number;
  expiringSoonPromoCodes: number;
}

export function BusinessOverview() {
  const { user } = useAuthStore();
  const [overview, setOverview] = useState<BusinessOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  // For demonstration, we'll use a mock business ID
  // In production, this would come from URL params or user's businesses list
  useEffect(() => {
    // Mock business ID - in production, get from user's owned businesses
    setBusinessId('cmf7ofthb0000c15cqexub8yc');
  }, []);

  useEffect(() => {
    if (!businessId || !user) return;

    const fetchOverview = async () => {
      try {
        setLoading(true);
        
        // For now, we'll use mock data since the API might not be fully connected yet
        // In production, this would be:
        // const response = await fetch(`/api/v1/business-dashboard/${businessId}/overview`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        
        // Mock data for demonstration
        const mockData: BusinessOverviewData = {
          metrics: {
            profileViews: 1247,
            contactClicks: 89,
            validationCount: 23,
            trustScore: 87,
            promoCodeUsage: 12,
            viewsThisMonth: 387,
            viewsLastMonth: 312,
            clicksThisMonth: 34,
            clicksLastMonth: 28,
            positiveValidations: 20,
            negativeValidations: 3,
            validationResponseRate: 0,
          },
          businessName: 'Hotel Caribe Plaza',
          businessCategory: 'HOTEL',
          verificationStatus: 'verified',
          actionItems: [
            'Respond to 3 new validations',
            'Update business description',
            '2 promo codes expiring soon'
          ],
          unreadValidations: 3,
          expiringSoonPromoCodes: 2,
        };

        setOverview(mockData);
      } catch (error) {
        console.error('Failed to fetch business overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [businessId, user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load business overview</p>
      </div>
    );
  }

  const viewsGrowth = overview.metrics.viewsLastMonth > 0 
    ? ((overview.metrics.viewsThisMonth - overview.metrics.viewsLastMonth) / overview.metrics.viewsLastMonth) * 100
    : 100;

  const clicksGrowth = overview.metrics.clicksLastMonth > 0
    ? ((overview.metrics.clicksThisMonth - overview.metrics.clicksLastMonth) / overview.metrics.clicksLastMonth) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Business Status Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{overview.businessName}</h2>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500">Category: {overview.businessCategory}</span>
              <div className="ml-4 flex items-center">
                {overview.verificationStatus === 'verified' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  overview.verificationStatus === 'verified' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {overview.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
          <QuickActions 
            actionItems={overview.actionItems}
            unreadValidations={overview.unreadValidations}
          />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Profile Views"
          value={overview.metrics.profileViews.toLocaleString()}
          icon={Eye}
          trend={viewsGrowth}
          subtitle="This month"
        />
        
        <DashboardCard
          title="Contact Clicks"
          value={overview.metrics.contactClicks.toLocaleString()}
          icon={MousePointer}
          trend={clicksGrowth}
          subtitle="This month"
        />
        
        <DashboardCard
          title="Trust Score"
          value={`${overview.metrics.trustScore}%`}
          icon={Shield}
          subtitle={`${overview.metrics.positiveValidations} positive validations`}
        />
        
        <DashboardCard
          title="Promo Codes"
          value={overview.metrics.promoCodeUsage.toLocaleString()}
          icon={Tag}
          subtitle="Times used this month"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <MetricChart 
            title="Performance Overview"
            data={{
              views: [
                { month: 'Jan', value: 245 },
                { month: 'Feb', value: 312 },
                { month: 'Mar', value: 387 },
              ],
              clicks: [
                { month: 'Jan', value: 23 },
                { month: 'Feb', value: 28 },
                { month: 'Mar', value: 34 },
              ]
            }}
          />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity businessId={businessId!} />
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Validation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {overview.metrics.positiveValidations}
            </div>
            <p className="text-sm text-gray-500">Positive Validations</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {overview.metrics.negativeValidations}  
            </div>
            <p className="text-sm text-gray-500">Negative Validations</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {overview.metrics.validationCount}
            </div>
            <p className="text-sm text-gray-500">Total Validations</p>
          </div>
        </div>
      </div>
    </div>
  );
}