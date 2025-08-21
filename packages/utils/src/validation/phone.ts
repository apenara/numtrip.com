/**
 * Phone validation utilities
 */

export const phoneValidation = {
  /**
   * Validates if a phone number is in a valid format
   * @param phone - The phone number to validate
   * @returns True if valid, false otherwise
   */
  isValid: (phone: string): boolean => {
    if (!phone || typeof phone !== 'string') return false;
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Valid phone numbers should have between 10 and 15 digits
    return cleaned.length >= 10 && cleaned.length <= 15;
  },

  /**
   * Formats a phone number for display
   * @param phone - The phone number to format
   * @param countryCode - The country code (default: +57 for Colombia)
   * @returns Formatted phone number
   */
  format: (phone: string, countryCode = '+57'): string => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    // If already has country code, return as is
    if (phone.startsWith('+')) {
      return phone;
    }
    
    // If starts with country code without +, add it
    if (cleaned.startsWith('57') && cleaned.length > 10) {
      return `+${cleaned}`;
    }
    
    // Add default country code
    return `${countryCode} ${cleaned}`;
  },

  /**
   * Formats a phone number specifically for WhatsApp
   * @param phone - The phone number to format
   * @param countryCode - The country code (default: 57 for Colombia)
   * @returns Formatted phone number for WhatsApp (without + or spaces)
   */
  formatForWhatsApp: (phone: string, countryCode = '57'): string => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    // If already has country code
    if (cleaned.startsWith(countryCode)) {
      return cleaned;
    }
    
    // Add country code
    return `${countryCode}${cleaned}`;
  },

  /**
   * Validates if a phone number could be a WhatsApp number
   * Basic validation - actual WhatsApp verification requires API call
   * @param phone - The phone number to validate
   * @returns True if potentially valid WhatsApp number
   */
  isPotentialWhatsApp: (phone: string): boolean => {
    return phoneValidation.isValid(phone);
  },

  /**
   * Extracts country code from phone number
   * @param phone - The phone number
   * @returns Country code or null if not found
   */
  extractCountryCode: (phone: string): string | null => {
    if (!phone) return null;
    
    const cleaned = phone.replace(/\D/g, '');
    
    // Common country codes (simplified list)
    const countryCodes = ['1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98'];
    
    for (const code of countryCodes.sort((a, b) => b.length - a.length)) {
      if (cleaned.startsWith(code)) {
        return code;
      }
    }
    
    return null;
  },

  /**
   * Creates a clickable phone URL
   * @param phone - The phone number
   * @returns tel: URL for phone calls
   */
  createPhoneUrl: (phone: string): string => {
    if (!phone) return '';
    const formatted = phoneValidation.format(phone);
    return `tel:${formatted}`;
  },

  /**
   * Creates a WhatsApp URL
   * @param phone - The phone number
   * @param message - Optional pre-filled message
   * @returns WhatsApp URL
   */
  createWhatsAppUrl: (phone: string, message = ''): string => {
    if (!phone) return '';
    
    const formattedPhone = phoneValidation.formatForWhatsApp(phone);
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
  },
};