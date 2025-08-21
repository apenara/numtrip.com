/**
 * Email validation utilities
 */

export const emailValidation = {
  /**
   * Validates if an email address is in a valid format
   * @param email - The email address to validate
   * @returns True if valid, false otherwise
   */
  isValid: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
  },

  /**
   * Normalizes an email address (lowercase, trim)
   * @param email - The email address to normalize
   * @returns Normalized email address
   */
  normalize: (email: string): string => {
    if (!email) return '';
    return email.trim().toLowerCase();
  },

  /**
   * Validates if an email domain is from a known provider
   * @param email - The email address to check
   * @returns True if from a known provider
   */
  isFromKnownProvider: (email: string): boolean => {
    if (!emailValidation.isValid(email)) return false;
    
    const domain = email.split('@')[1]?.toLowerCase();
    const knownProviders = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'icloud.com',
      'protonmail.com',
      'aol.com',
      'live.com',
      'msn.com',
      'yandex.com',
    ];
    
    return knownProviders.includes(domain);
  },

  /**
   * Extracts domain from email address
   * @param email - The email address
   * @returns Domain or null if invalid
   */
  extractDomain: (email: string): string | null => {
    if (!emailValidation.isValid(email)) return null;
    return email.split('@')[1]?.toLowerCase() || null;
  },

  /**
   * Masks an email address for privacy (keeps first char and domain)
   * @param email - The email address to mask
   * @returns Masked email address
   */
  mask: (email: string): string => {
    if (!emailValidation.isValid(email)) return email;
    
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 1) return email;
    
    const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  },

  /**
   * Creates a mailto URL
   * @param email - The email address
   * @param subject - Optional subject
   * @param body - Optional body
   * @returns mailto: URL
   */
  createMailtoUrl: (email: string, subject = '', body = ''): string => {
    if (!email) return '';
    
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    
    const queryString = params.toString();
    return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
  },

  /**
   * Validates if email might be a business email (not from personal providers)
   * @param email - The email address to check
   * @returns True if potentially a business email
   */
  isPotentialBusinessEmail: (email: string): boolean => {
    if (!emailValidation.isValid(email)) return false;
    
    // If it's from a known personal provider, it's probably not business
    if (emailValidation.isFromKnownProvider(email)) return false;
    
    const domain = emailValidation.extractDomain(email);
    if (!domain) return false;
    
    // Basic heuristics for business emails
    // Business domains usually have at least one dot and are not common free providers
    return domain.includes('.') && !domain.endsWith('.tk') && !domain.endsWith('.ml');
  },
};