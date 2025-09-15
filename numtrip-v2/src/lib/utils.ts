import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SEO utilities
export function generateBusinessSlug(business: {
  name: string;
  city?: string;
  verified: boolean;
}, locale: string = 'es'): string {
  const nameSlug = business.name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const hasValidCity = business.city &&
                      business.city.toLowerCase() !== 'unknown' &&
                      business.city.trim() !== '';
  const citySlug = hasValidCity && business.city ? business.city
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') : '';

  const isSpanish = locale === 'es';
  const prefix = isSpanish ? 'contacto-de' : 'contact-for';
  const verificationStatus = isSpanish
    ? (business.verified ? 'verificado' : 'no-verificado')
    : (business.verified ? 'verified' : 'not-verified');

  const parts = [prefix, nameSlug];
  if (citySlug) {
    parts.push(citySlug);
  }
  parts.push(verificationStatus);

  return parts.join('-');
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}