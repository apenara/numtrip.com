'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CheckCircle, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { PopularBusinesses } from '@/components/business/PopularBusinesses';
import PublicLayout from '@/components/layout/PublicLayout';
import Footer from '@/components/layout/Footer';
import StructuredData from '@/components/seo/StructuredData';
import Head from 'next/head';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <StructuredData type="website" data={{}} />
      <StructuredData type="organization" data={{}} />
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
            <nav className="hidden md:flex space-x-8">
              <a href="/search" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('nav.search')}
              </a>
              <a href="/search" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('nav.businesses')}
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('nav.about')}
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${searchQuery}`); }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent shadow-lg"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2">
                  {t('hero.searchButton')}
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div onClick={() => router.push('/search?category=HOTEL')} className="card card-hover p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.hotels')}
              </h3>
              <p className="text-gray-600">
                {t('categories.hotelsDescription')}
              </p>
            </div>
            
            <div onClick={() => router.push('/search?category=TOUR')} className="card card-hover p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.tours')}
              </h3>
              <p className="text-gray-600">
                {t('categories.toursDescription')}
              </p>
            </div>
            
            <div onClick={() => router.push('/search?category=TRANSPORT')} className="card card-hover p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.transport')}
              </h3>
              <p className="text-gray-600">
                {t('categories.transportDescription')}
              </p>
            </div>

            <div onClick={() => router.push('/search?category=RESTAURANT')} className="card card-hover p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.restaurants')}
              </h3>
              <p className="text-gray-600">
                {t('categories.restaurantsDescription')}
              </p>
            </div>
          </div>

          {/* Featured Cities */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div onClick={() => router.push('/search?city=Cartagena')} className="card card-hover p-4 text-center cursor-pointer">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Cartagena
              </h3>
              <p className="text-sm text-gray-600">
                {t('cities.cartagenaDescription')}
              </p>
            </div>

            <div onClick={() => router.push('/search')} className="card card-hover p-4 text-center cursor-pointer">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t('actions.exploreAll')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('actions.exploreAllDescription')}
              </p>
            </div>

            <div className="card p-4 text-center">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t('features.verified')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('features.verifiedDescription')}
              </p>
            </div>
          </div>

          {/* Popular Businesses Section */}
          <div className="mt-16">
            <PopularBusinesses limit={6} daysBack={30} />
          </div>
        </div>
      </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}