'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                NumTrip
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/search" className="text-gray-500 hover:text-gray-900 transition-colors">
                Search
              </a>
              <a href="/search" className="text-gray-500 hover:text-gray-900 transition-colors">
                Businesses
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Verified Tourism Contacts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get phone numbers, emails, and WhatsApp contacts for hotels, tours, and transportation in Cartagena
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
                  placeholder="Search hotels, tours, transport..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div onClick={() => router.push('/search?category=HOTEL')} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hotels
              </h3>
              <p className="text-gray-600">
                Find verified hotel contacts
              </p>
            </div>
            
            <div onClick={() => router.push('/search?category=TOUR')} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tours
              </h3>
              <p className="text-gray-600">
                Discover tour operators
              </p>
            </div>
            
            <div onClick={() => router.push('/search?category=TRANSPORT')} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transport
              </h3>
              <p className="text-gray-600">
                Find transportation services
              </p>
            </div>
          </div>

          {/* Sample Business Card */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hotel Ejemplo Cartagena
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Hotel
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-mono text-sm">+57 5 664 9494</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Copy
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">info@hotelcartagena.com</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Copy
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span className="font-mono text-sm">+57 300 123 4567</span>
                </div>
                <button className="bg-green-600 text-white text-sm py-1 px-3 rounded-md hover:bg-green-700">
                  WhatsApp
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Promo Code:</strong> NUMTRIP20 - 20% discount
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}