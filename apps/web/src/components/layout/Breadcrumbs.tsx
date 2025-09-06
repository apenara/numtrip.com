'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const router = useRouter();

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <button
        onClick={() => handleClick('/')}
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          {item.current ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => handleClick(item.href)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to generate breadcrumbs from business data
export function generateBusinessBreadcrumbs(business: {
  name: string;
  category: string;
  city: string;
  id: string;
}) {
  const categoryLabels: Record<string, string> = {
    HOTEL: 'Hoteles',
    TOUR: 'Tours',
    TRANSPORT: 'Transporte',
    RESTAURANT: 'Restaurantes',
    ATTRACTION: 'Atracciones',
    OTHER: 'Otros'
  };

  return [
    {
      label: business.city,
      href: `/search?city=${encodeURIComponent(business.city)}`
    },
    {
      label: categoryLabels[business.category] || business.category,
      href: `/search?city=${encodeURIComponent(business.city)}&category=${business.category}`
    },
    {
      label: business.name,
      current: true
    }
  ];
}