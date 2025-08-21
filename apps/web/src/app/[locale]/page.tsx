import { useTranslations } from 'next-intl';
import { Search, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
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
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                {t('nav.search')}
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2">
                {t('hero.searchButton')}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="card card-hover p-6 text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-hotel-purple" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.hotels')}
              </h3>
              <p className="text-gray-600">
                {t('categories.hotelsDescription')}
              </p>
            </div>
            
            <div className="card card-hover p-6 text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-tour-orange" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.tours')}
              </h3>
              <p className="text-gray-600">
                {t('categories.toursDescription')}
              </p>
            </div>
            
            <div className="card card-hover p-6 text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-transport-blue" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('categories.transport')}
              </h3>
              <p className="text-gray-600">
                {t('categories.transportDescription')}
              </p>
            </div>
          </div>

          {/* Sample Business Card */}
          <div className="max-w-md mx-auto card p-6 text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hotel Ejemplo Cartagena
                  </h3>
                  <span className="badge badge-verified">
                    ✓ {t('verified')}
                  </span>
                </div>
                <span className="badge badge-hotel">
                  {t('categories.hotels')}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="contact-item">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-sm">+57 5 664 9494</span>
                <button className="ml-auto text-primary-blue hover:text-primary-blue-hover text-sm">
                  {t('copy')}
                </button>
              </div>
              
              <div className="contact-item">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">info@hotelcartagena.com</span>
                <button className="ml-auto text-primary-blue hover:text-primary-blue-hover text-sm">
                  {t('copy')}
                </button>
              </div>
              
              <div className="contact-item">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span className="font-mono text-sm">+57 300 123 4567</span>
                <button className="ml-auto btn-primary text-sm py-1 px-3">
                  WhatsApp
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Código promocional:</strong> NUMTRIP20 - 20% de descuento
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}