export interface IndexNowResponse {
  success: boolean;
  message?: string;
  error?: string;
  urls?: string[];
}

class IndexNowService {
  private baseUrl: string;
  private batchSize = 100; // IndexNow recommended batch size

  constructor() {
    this.baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://numtrip.com';
  }

  /**
   * Submit URLs to IndexNow for immediate indexing
   */
  async submitUrls(urls: string[]): Promise<IndexNowResponse> {
    try {
      const response = await fetch('/api/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit URLs');
      }

      return data;
    } catch (error) {
      console.error('IndexNow submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Submit URLs in batches to avoid rate limits
   */
  async submitUrlsBatch(urls: string[]): Promise<IndexNowResponse[]> {
    const results: IndexNowResponse[] = [];

    for (let i = 0; i < urls.length; i += this.batchSize) {
      const batch = urls.slice(i, i + this.batchSize);
      const result = await this.submitUrls(batch);
      results.push(result);

      // Add a small delay between batches to avoid rate limiting
      if (i + this.batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Submit a single URL to IndexNow
   */
  async submitUrl(url: string): Promise<IndexNowResponse> {
    return this.submitUrls([url]);
  }

  /**
   * Submit business page URL for indexing
   */
  async submitBusinessUrl(slug: string, locale: string = 'es'): Promise<IndexNowResponse> {
    const url = `${this.baseUrl}/${locale}/business/${slug}`;
    return this.submitUrl(url);
  }

  /**
   * Submit multiple business URLs
   */
  async submitBusinessUrls(slugs: string[], locale: string = 'es'): Promise<IndexNowResponse> {
    const urls = slugs.map(slug => `${this.baseUrl}/${locale}/business/${slug}`);
    return this.submitUrls(urls);
  }

  /**
   * Submit search page URL for indexing
   */
  async submitSearchUrl(params: {
    category?: string;
    city?: string;
    locale?: string;
  }): Promise<IndexNowResponse> {
    const { category, city, locale = 'es' } = params;
    let url = `${this.baseUrl}/${locale}/search`;

    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (city) queryParams.append('city', city);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return this.submitUrl(url);
  }

  /**
   * Submit the home page for indexing
   */
  async submitHomePage(locale: string = 'es'): Promise<IndexNowResponse> {
    const url = `${this.baseUrl}/${locale}`;
    return this.submitUrl(url);
  }

  /**
   * Check if IndexNow is configured
   */
  async checkConfiguration(): Promise<{ configured: boolean; keyFile?: string }> {
    try {
      const response = await fetch('/api/indexnow', {
        method: 'GET',
      });

      if (!response.ok) {
        return { configured: false };
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to check IndexNow configuration:', error);
      return { configured: false };
    }
  }
}

export const indexNowService = new IndexNowService();