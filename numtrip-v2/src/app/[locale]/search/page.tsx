'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Search,
  Filter,
  MapPin,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { BusinessService } from '@/lib/business.service';
import { Business, BusinessCategory, BusinessSearchParams } from '@/types/business';
import { BusinessCard } from '@/components/business/BusinessCard';
import { AdBannerSidebar, AdBannerInFeed } from '@/components/ads/AdBanner';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

const categories = [
  { value: 'HOTEL', label: 'Hoteles', icon: '🏨', color: 'bg-blue-100 text-blue-800' },
  { value: 'TOUR', label: 'Tours', icon: '🗺️', color: 'bg-green-100 text-green-800' },
  { value: 'TRANSPORT', label: 'Transporte', icon: '🚗', color: 'bg-purple-100 text-purple-800' },
  { value: 'RESTAURANT', label: 'Restaurantes', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
  { value: 'ATTRACTION', label: 'Atracciones', icon: '🎯', color: 'bg-pink-100 text-pink-800' },
];

const cities = [
  'Cartagena',
  'Barranquilla',
  'Santa Marta',
  'Bogotá',
  'Medellín',
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | undefined>(
    searchParams.get('category') as BusinessCategory || undefined
  );
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Results state
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Search function
  const searchBusinesses = async () => {
    setLoading(true);
    try {
      const searchParams: BusinessSearchParams = {
        query: query || undefined,
        category: selectedCategory,
        city: selectedCity || undefined,
        verified: verifiedOnly || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      const result = await BusinessService.searchBusinesses(searchParams);
      setBusinesses(result.items);
      setTotalCount(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error searching businesses:', error);
      setBusinesses([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Effect to search when filters change
  useEffect(() => {
    searchBusinesses();
  }, [query, selectedCategory, selectedCity, verifiedOnly, currentPage]);

  // Update URL when filters change (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCity) params.set('city', selectedCity);
    if (verifiedOnly) params.set('verified', 'true');
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newURL = `/${locale}/search${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  }, [query, selectedCategory, selectedCity, verifiedOnly, currentPage, locale]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    searchBusinesses();
  };

  // Handle filter changes
  const handleCategoryChange = (category: BusinessCategory | undefined) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleVerifiedChange = (verified: boolean) => {
    setVerifiedOnly(verified);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setQuery('');
    setSelectedCategory(undefined);
    setSelectedCity('');
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  // Active filters count
  const activeFiltersCount = [
    query,
    selectedCategory,
    selectedCity,
    verifiedOnly
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-blue" />
              <span className="ml-2 text-xl font-bold text-gray-900">NumTrip</span>
            </div>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="text-primary-blue hover:text-primary-blue-dark transition-colors"
            >
              Inicio
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Negocios</h1>
          <p className="text-gray-600">
            Encuentra contactos verificados de hoteles, tours, transporte y restaurantes
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, descripción..."
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent shadow-sm"
            />
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-auto bg-primary-blue text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filters */}
            <div className={cn(
              "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
              showFilters ? "block" : "hidden lg:block"
            )}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categoría</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => handleCategoryChange(undefined)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">Todas las categorías</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.value} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.value}
                        onChange={() => handleCategoryChange(category.value as BusinessCategory)}
                        className="mr-3"
                      />
                      <span className="flex items-center gap-2 text-gray-700">
                        <span className="text-sm">{category.icon}</span>
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Ciudad</h3>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="">Todas las ciudades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => handleVerifiedChange(e.target.checked)}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Solo verificados</span>
                  </div>
                </label>
              </div>

              {/* Sidebar Ad */}
              <div className="mt-8">
                <AdBannerSidebar />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {loading ? 'Buscando...' : `${totalCount} resultados`}
                </h2>
                {!loading && totalCount > 0 && (
                  <p className="text-gray-600 text-sm">
                    Página {currentPage} de {totalPages}
                  </p>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && !loading && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {query && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Búsqueda: "{query}"
                      <button onClick={() => setQuery('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {categories.find(c => c.value === selectedCategory)?.label}
                      <button onClick={() => setSelectedCategory(undefined)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCity && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {selectedCity}
                      <button onClick={() => setSelectedCity('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {verifiedOnly && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <CheckCircle className="h-3 w-3" />
                      Verificados
                      <button onClick={() => setVerifiedOnly(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Buscando negocios...</span>
              </div>
            )}

            {/* No Results */}
            {!loading && totalCount === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary-blue hover:text-primary-blue-dark transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!loading && businesses.length > 0 && (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {businesses.map((business, index) => (
                    <div key={business.id}>
                      <BusinessCard
                        business={business}
                        showDistance={false}
                      />
                      {/* Insert ad after every 6 results */}
                      {(index + 1) % 6 === 0 && index < businesses.length - 1 && (
                        <div className="col-span-full mt-6 mb-6">
                          <AdBannerInFeed />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "px-3 py-2 rounded-lg transition-colors",
                              currentPage === page
                                ? "bg-primary-blue text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}