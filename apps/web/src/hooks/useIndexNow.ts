import { useEffect } from 'react';
import { indexNowService } from '@/services/indexnow.service';

interface UseIndexNowOptions {
  immediate?: boolean;
  delay?: number;
}

/**
 * Hook to submit current page to IndexNow for indexing
 */
export function useIndexNow(options: UseIndexNowOptions = {}) {
  const { immediate = true, delay = 5000 } = options;

  useEffect(() => {
    if (!immediate) return;

    const timeout = setTimeout(() => {
      const currentUrl = window.location.href;
      indexNowService.submitUrl(currentUrl).then(result => {
        if (result.success) {
          console.log('Page submitted to IndexNow:', currentUrl);
        } else if (result.error) {
          console.error('Failed to submit to IndexNow:', result.error);
        }
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [immediate, delay]);
}

/**
 * Hook to submit business page to IndexNow after updates
 */
export function useBusinessIndexNow(slug: string | null, locale: string = 'es') {
  const submitToIndexNow = async () => {
    if (!slug) return;

    const result = await indexNowService.submitBusinessUrl(slug, locale);
    if (result.success) {
      console.log('Business page submitted to IndexNow');
    }
  };

  return { submitToIndexNow };
}