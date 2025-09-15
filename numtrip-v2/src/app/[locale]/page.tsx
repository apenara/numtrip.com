'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, MapPin, CheckCircle } from 'lucide-react';
import StructuredData from '@/components/seo/StructuredData';
import { PopularBusinesses } from '@/components/business/PopularBusinesses';
import { AdBannerTop, AdBannerInFeed } from '@/components/ads/AdBanner';
import { BusinessCategory } from '@/types/business';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    router.push(`/${locale}/search?${params.toString()}`);
  };

  const handleCategoryClick = (category: BusinessCategory) => {
    router.push(`/${locale}/search?category=${category}`);
  };

  return (
    <>
      <StructuredData type="website" data={{}} />
      <StructuredData type="organization" data={{}} />
      <StructuredData type="searchAction" data={{}} />

      <div className="min-h-screen bg-gradient-to-br from-primary-blue-light to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-blue" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                NumTrip
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Directorio de Contactos Turísticos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Encuentra números de WhatsApp, teléfonos y emails verificados de hoteles, tours y transporte en Cartagena
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar hoteles, tours, transporte..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div
              onClick={() => handleCategoryClick(BusinessCategory.HOTEL)}
              className="card card-hover p-6 text-center cursor-pointer"
            >
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hoteles
              </h3>
              <p className="text-gray-600">
                Contactos verificados de hoteles y alojamientos
              </p>
            </div>

            <div
              onClick={() => handleCategoryClick(BusinessCategory.TOUR)}
              className="card card-hover p-6 text-center cursor-pointer"
            >
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tours
              </h3>
              <p className="text-gray-600">
                Agencias de tours y experiencias turísticas
              </p>
            </div>

            <div
              onClick={() => handleCategoryClick(BusinessCategory.TRANSPORT)}
              className="card card-hover p-6 text-center cursor-pointer"
            >
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transporte
              </h3>
              <p className="text-gray-600">
                Taxis, transfers y servicios de transporte
              </p>
            </div>

            <div
              onClick={() => handleCategoryClick(BusinessCategory.RESTAURANT)}
              className="card card-hover p-6 text-center cursor-pointer"
            >
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Restaurantes
              </h3>
              <p className="text-gray-600">
                Restaurantes y experiencias gastronómicas
              </p>
            </div>
          </div>

          {/* Top Banner Ad */}
          <div className="mb-12">
            <AdBannerTop className="max-w-4xl mx-auto" />
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="card p-4 text-center">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Cartagena
              </h3>
              <p className="text-sm text-gray-600">
                Ciudad amurallada y destino turístico
              </p>
            </div>

            <div className="card p-4 text-center">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Buscar Todo
              </h3>
              <p className="text-sm text-gray-600">
                Encuentra cualquier servicio turístico
              </p>
            </div>

            <div className="card p-4 text-center">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Verificado
              </h3>
              <p className="text-sm text-gray-600">
                Contactos verificados por la comunidad
              </p>
            </div>
          </div>

          {/* Popular Businesses Section */}
          <div className="mt-16">
            <PopularBusinesses
              limit={6}
              daysBack={30}
              showTitle={true}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            />
          </div>

          {/* In-Feed Ad */}
          <div className="mt-12">
            <AdBannerInFeed className="max-w-4xl mx-auto" />
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-primary-blue rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                ¿No encuentras tu negocio?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Agrega tu hotel, tour, transporte o restaurante a nuestro directorio.
                Es gratis y te conecta directamente con miles de turistas.
              </p>
              <button
                onClick={() => router.push(`/${locale}/add-business`)}
                className="bg-white text-primary-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Agregar Mi Negocio
              </button>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}