/**
 * URL validation utilities
 */

export const urlValidation = {
  /**
   * Validates if a URL is in a valid format
   * @param url - The URL to validate
   * @returns True if valid, false otherwise
   */
  isValid: (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Normalizes a URL (adds protocol if missing, removes trailing slash)
   * @param url - The URL to normalize
   * @returns Normalized URL
   */
  normalize: (url: string): string => {
    if (!url) return '';
    
    let normalized = url.trim();
    
    // Add protocol if missing
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = `https://${normalized}`;
    }
    
    try {
      const urlObj = new URL(normalized);
      // Remove trailing slash from pathname
      if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }
      return urlObj.toString();
    } catch {
      return url;
    }
  },

  /**
   * Extracts domain from URL
   * @param url - The URL
   * @returns Domain or null if invalid
   */
  extractDomain: (url: string): string | null => {
    try {
      const urlObj = new URL(urlValidation.normalize(url));
      return urlObj.hostname;
    } catch {
      return null;
    }
  },

  /**
   * Checks if URL is HTTPS
   * @param url - The URL to check
   * @returns True if HTTPS, false otherwise
   */
  isSecure: (url: string): boolean => {
    try {
      const urlObj = new URL(urlValidation.normalize(url));
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Checks if URL appears to be a social media profile
   * @param url - The URL to check
   * @returns True if appears to be social media
   */
  isSocialMedia: (url: string): boolean => {
    const domain = urlValidation.extractDomain(url);
    if (!domain) return false;
    
    const socialDomains = [
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'youtube.com',
      'tiktok.com',
      'pinterest.com',
      'snapchat.com',
      'whatsapp.com',
      'telegram.org',
    ];
    
    return socialDomains.some(social => 
      domain === social || domain.endsWith(`.${social}`)
    );
  },

  /**
   * Shortens a URL for display purposes
   * @param url - The URL to shorten
   * @param maxLength - Maximum length (default: 50)
   * @returns Shortened URL
   */
  shorten: (url: string, maxLength = 50): string => {
    if (!url) return '';
    
    const domain = urlValidation.extractDomain(url);
    if (!domain) return url;
    
    if (url.length <= maxLength) return url;
    
    try {
      const urlObj = new URL(urlValidation.normalize(url));
      const path = urlObj.pathname + urlObj.search;
      
      if (domain.length >= maxLength - 3) {
        return domain.substring(0, maxLength - 3) + '...';
      }
      
      const remainingLength = maxLength - domain.length - 3; // 3 for "..."
      if (path.length > remainingLength) {
        return domain + path.substring(0, remainingLength) + '...';
      }
      
      return domain + path;
    } catch {
      return url.substring(0, maxLength - 3) + '...';
    }
  },

  /**
   * Creates a safe external link (with noopener, noreferrer)
   * @param url - The URL
   * @returns Object with href and rel attributes
   */
  createSafeExternalLink: (url: string) => ({
    href: urlValidation.normalize(url),
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
};