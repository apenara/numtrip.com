'use client';

import { useEffect, useState } from 'react';
import { BusinessService } from '@/lib/business.service';
import { Business } from '@/types/business';
import { PopularBusinesses } from '@/components/business/PopularBusinesses';
import { BusinessCard } from '@/components/business/BusinessCard';

export default function TestPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('Testing Supabase connection...');

        // Test basic search
        const searchResult = await BusinessService.searchBusinesses({
          limit: 5
        });

        console.log('Search result:', searchResult);
        setBusinesses(searchResult.items);

      } catch (err) {
        console.error('Error testing connection:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
          <p className="text-gray-600">
            Check console for more details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            NumTrip v2 - Test Page
          </h1>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Supabase connection successful! Found {businesses.length} businesses.
          </div>
        </div>

        {/* Raw Data Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Raw Business Data</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(businesses, null, 2)}
            </pre>
          </div>
        </div>

        {/* Business Cards Test */}
        {businesses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Business Cards Test</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.slice(0, 3).map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  showDistance={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* PopularBusinesses Component Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">PopularBusinesses Component Test</h2>
          <PopularBusinesses
            limit={6}
            daysBack={30}
            showTitle={true}
            className="bg-white rounded-lg shadow p-6"
          />
        </div>

        {/* Compact PopularBusinesses Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">PopularBusinesses Compact Test</h2>
          <div className="bg-white rounded-lg shadow p-6 max-w-md">
            <PopularBusinesses
              limit={5}
              daysBack={30}
              showTitle={true}
              variant="compact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}