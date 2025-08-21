/**
 * Number formatting utilities
 */

export const numberFormatters = {
  /**
   * Formats a number with locale-specific separators
   * @param number - The number to format
   * @param locale - The locale (default: 'es-CO' for Colombia)
   * @param options - Intl.NumberFormatOptions
   * @returns Formatted number string
   */
  toLocalizedString: (
    number: number,
    locale = 'es-CO',
    options: Intl.NumberFormatOptions = {}
  ): string => {
    try {
      return number.toLocaleString(locale, options);
    } catch {
      return number.toString();
    }
  },

  /**
   * Formats a number as currency
   * @param amount - The amount to format
   * @param currency - The currency code (default: 'COP' for Colombian Pesos)
   * @param locale - The locale (default: 'es-CO')
   * @returns Formatted currency string
   */
  toCurrency: (
    amount: number,
    currency = 'COP',
    locale = 'es-CO'
  ): string => {
    try {
      return amount.toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } catch {
      return `${currency} ${amount}`;
    }
  },

  /**
   * Formats a number as percentage
   * @param number - The number to format (e.g., 0.2 for 20%)
   * @param locale - The locale (default: 'es-CO')
   * @param decimals - Number of decimal places (default: 0)
   * @returns Formatted percentage string
   */
  toPercentage: (
    number: number,
    locale = 'es-CO',
    decimals = 0
  ): string => {
    try {
      return number.toLocaleString(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    } catch {
      return `${(number * 100).toFixed(decimals)}%`;
    }
  },

  /**
   * Formats a large number with compact notation (e.g., 1.2K, 1.5M)
   * @param number - The number to format
   * @param locale - The locale (default: 'es-CO')
   * @returns Compact formatted number string
   */
  toCompactNumber: (number: number, locale = 'es-CO'): string => {
    try {
      // Use Intl.NumberFormat with compact notation if available
      if ('compactDisplay' in Intl.NumberFormat.prototype) {
        return number.toLocaleString(locale, {
          notation: 'compact',
          compactDisplay: 'short',
        });
      }
      
      // Fallback for older browsers
      if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`;
      } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
      }
      
      return number.toString();
    } catch {
      return number.toString();
    }
  },

  /**
   * Formats a number with ordinal suffix (1st, 2nd, 3rd, etc.)
   * @param number - The number to format
   * @param locale - The locale (default: 'es-CO')
   * @returns Number with ordinal suffix
   */
  toOrdinal: (number: number, locale = 'es-CO'): string => {
    try {
      // Use Intl.PluralRules for proper ordinal handling
      if ('PluralRules' in Intl) {
        const pr = new Intl.PluralRules(locale, { type: 'ordinal' });
        const rule = pr.select(number);
        
        // Spanish ordinals
        if (locale.startsWith('es')) {
          const suffixes: Record<string, string> = {
            one: 'º',
            two: 'º',
            few: 'º',
            other: 'º',
          };
          return `${number}${suffixes[rule] || 'º'}`;
        }
        
        // English ordinals
        const suffixes: Record<string, string> = {
          one: 'st',
          two: 'nd',
          few: 'rd',
          other: 'th',
        };
        return `${number}${suffixes[rule] || 'th'}`;
      }
      
      // Fallback
      if (locale.startsWith('es')) {
        return `${number}º`;
      }
      
      const lastDigit = number % 10;
      const lastTwoDigits = number % 100;
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${number}th`;
      }
      
      switch (lastDigit) {
        case 1: return `${number}st`;
        case 2: return `${number}nd`;
        case 3: return `${number}rd`;
        default: return `${number}th`;
      }
    } catch {
      return number.toString();
    }
  },

  /**
   * Formats a number with units (bytes, distance, etc.)
   * @param number - The number to format
   * @param unit - The unit type
   * @param locale - The locale (default: 'es-CO')
   * @returns Formatted number with unit
   */
  withUnit: (
    number: number,
    unit: 'byte' | 'kilometer' | 'meter' | 'gram' | 'kilogram',
    locale = 'es-CO'
  ): string => {
    try {
      return number.toLocaleString(locale, {
        style: 'unit',
        unit,
        unitDisplay: 'short',
      });
    } catch {
      // Fallback unit mapping
      const unitMap: Record<string, string> = {
        byte: 'B',
        kilometer: 'km',
        meter: 'm',
        gram: 'g',
        kilogram: 'kg',
      };
      
      return `${number} ${unitMap[unit] || unit}`;
    }
  },
};