'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  ChevronLeft, 
  MapPin, 
  Menu, 
  Search,
  X 
} from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  minimal?: boolean;
}

export function Header({ showBackButton = false, title, minimal = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const t = useTranslations('Header');

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  if (minimal) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
              
              <button
                onClick={handleLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <MapPin className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  NumTrip
                </span>
              </button>
              
              {title && (
                <div className="hidden sm:block">
                  <span className="text-gray-400 mx-2">/</span>
                  <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                </div>
              )}
            </div>

            {/* Mobile title */}
            {title && (
              <div className="sm:hidden">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">
                  {title}
                </h1>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
            
            <button
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                NumTrip
              </span>
            </button>
          </div>

          {/* Search bar - hidden on mobile when title is present */}
          {!minimal && (
            <div className={`flex-1 max-w-lg mx-8 ${title ? 'hidden lg:block' : 'hidden sm:block'}`}>
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('searchPlaceholder')}
                />
              </form>
            </div>
          )}

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push('/search')}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t('search')}
            </button>
            <button
              onClick={() => router.push('/search?verified=true')}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t('verified')}
            </button>
            <button
              onClick={() => router.push('/about')}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t('about')}
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {!minimal && (
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('searchPlaceholder')}
                  />
                </form>
              </div>
            )}
            
            <nav className="space-y-2">
              <button
                onClick={() => {
                  router.push('/search');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t('search')}
              </button>
              <button
                onClick={() => {
                  router.push('/search?verified=true');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t('verified')}
              </button>
              <button
                onClick={() => {
                  router.push('/about');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t('about')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}