/**
 * Date formatting utilities
 */

export const dateFormatters = {
  /**
   * Formats a date to a localized string
   * @param date - The date to format
   * @param locale - The locale (default: 'es-CO' for Colombia)
   * @param options - Intl.DateTimeFormatOptions
   * @returns Formatted date string
   */
  toLocalizedString: (
    date: Date | string,
    locale = 'es-CO',
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString(locale, options);
    } catch {
      return '';
    }
  },

  /**
   * Formats a date to relative time (e.g., "hace 2 días")
   * @param date - The date to format
   * @param locale - The locale (default: 'es-CO')
   * @returns Relative time string
   */
  toRelativeTime: (date: Date | string, locale = 'es-CO'): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      // Use Intl.RelativeTimeFormat if available
      if ('RelativeTimeFormat' in Intl) {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (Math.abs(diffInSeconds) < 60) {
          return rtf.format(-diffInSeconds, 'second');
        } else if (Math.abs(diffInSeconds) < 3600) {
          return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
        } else if (Math.abs(diffInSeconds) < 86400) {
          return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
        } else if (Math.abs(diffInSeconds) < 2592000) {
          return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
        } else if (Math.abs(diffInSeconds) < 31536000) {
          return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
        } else {
          return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
        }
      }

      // Fallback for older browsers
      const absSeconds = Math.abs(diffInSeconds);
      if (absSeconds < 60) return 'hace unos segundos';
      if (absSeconds < 3600) return `hace ${Math.floor(absSeconds / 60)} minutos`;
      if (absSeconds < 86400) return `hace ${Math.floor(absSeconds / 3600)} horas`;
      if (absSeconds < 2592000) return `hace ${Math.floor(absSeconds / 86400)} días`;
      if (absSeconds < 31536000) return `hace ${Math.floor(absSeconds / 2592000)} meses`;
      return `hace ${Math.floor(absSeconds / 31536000)} años`;
    } catch {
      return '';
    }
  },

  /**
   * Formats a date for business hours display
   * @param date - The date to format
   * @param locale - The locale (default: 'es-CO')
   * @returns Time string (e.g., "14:30")
   */
  toTimeString: (date: Date | string, locale = 'es-CO'): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '';
    }
  },

  /**
   * Checks if a date is today
   * @param date - The date to check
   * @returns True if the date is today
   */
  isToday: (date: Date | string): boolean => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      
      return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
    }
  },

  /**
   * Formats a date range
   * @param startDate - Start date
   * @param endDate - End date
   * @param locale - The locale (default: 'es-CO')
   * @returns Formatted date range string
   */
  toDateRange: (
    startDate: Date | string,
    endDate: Date | string,
    locale = 'es-CO'
  ): string => {
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
      
      const startFormatted = dateFormatters.toLocalizedString(start, locale, {
        day: 'numeric',
        month: 'short',
      });
      
      const endFormatted = dateFormatters.toLocalizedString(end, locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      
      return `${startFormatted} - ${endFormatted}`;
    } catch {
      return '';
    }
  },
};