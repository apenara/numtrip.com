'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Phone, Mail, MessageCircle, Filter, ChevronDown } from 'lucide-react';
import { BusinessService } from '@/services/business.service';
import { Business, BusinessCategory } from '@contactos-turisticos/types';
import Link from 'next/link';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const t = useTranslations('SearchPage');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | ''>(
    (searchParams.get('category') as BusinessCategory) || ''
  );
  const [selectedCity, setSelectedCity] = useState('Cartagena');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: BusinessCategory.HOTEL, label: 'Hotels', color: 'bg-purple-100 text-hotel-purple' },
    { value: BusinessCategory.TOUR, label: 'Tours', color: 'bg-orange-100 text-tour-orange' },
    { value: BusinessCategory.TRANSPORT, label: 'Transport', color: 'bg-blue-100 text-transport-blue' },
    { value: BusinessCategory.RESTAURANT, label: 'Restaurants', color: 'bg-green-100 text-green-600' },
    { value: BusinessCategory.ATTRACTION, label: 'Attractions', color: 'bg-pink-100 text-pink-600' },
  ];

  useEffect(() => {
    searchBusinesses();
  }, [page, selectedCategory, selectedCity, showVerifiedOnly]);

  const searchBusinesses = async () => {
    setLoading(true);
    try {
      const params = {
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        city: selectedCity || undefined,
        verified: showVerifiedOnly || undefined,
        page,
        limit: 12,
      };
      
      const response = await BusinessService.searchBusinesses(params);
      setBusinesses(response.items || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    searchBusinesses();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCategoryBadgeClass = (category: BusinessCategory) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-blue" />
              <span className="ml-2 text-xl font-bold text-gray-900">NumTrip</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hotels, tours, transport..."
              className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === '' ? 'bg-primary-blue text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value ? 'bg-primary-blue text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
              />
              <span className="text-gray-700">Verified Only</span>
            </label>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              <option value="Cartagena">Cartagena</option>
              <option value="Bogota">Bogotá</option>
              <option value="Medellin">Medellín</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {businesses.map((business) => (
                <div key={business.id} className="card p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{business.name}</h3>
                      {business.verified && (
                        <span className="badge badge-verified ml-2">✓ Verified</span>
                      )}
                    </div>
                    <span className={`badge ${getCategoryBadgeClass(business.category as BusinessCategory)} inline-block`}>
                      {business.category}
                    </span>
                  </div>

                  {business.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{business.description}</p>
                  )}

                  <div className="space-y-2">
                    {business.phone && (
                      <div className="contact-item">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="font-mono text-sm flex-1">{business.phone}</span>
                        <button
                          onClick={() => copyToClipboard(business.phone!)}
                          className="text-primary-blue hover:text-primary-blue-hover text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                    
                    {business.email && (
                      <div className="contact-item">
                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm flex-1 truncate">{business.email}</span>
                        <button
                          onClick={() => copyToClipboard(business.email!)}
                          className="text-primary-blue hover:text-primary-blue-hover text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                    
                    {business.whatsapp && (
                      <div className="contact-item">
                        <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="font-mono text-sm flex-1">{business.whatsapp}</span>
                        <a
                          href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm py-1 px-3"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                  {business.promoCodes && business.promoCodes.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Promo:</strong> {business.promoCodes[0].code} - {business.promoCodes[0].discount}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/business/${business.id}`}
                    className="mt-4 block text-center text-primary-blue hover:text-primary-blue-hover font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>

            {businesses.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">No businesses found. Try adjusting your filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
    </div>}>
      <SearchPageContent />
    </Suspense>
  );
}