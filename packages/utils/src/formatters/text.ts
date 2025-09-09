/**
 * Text formatting utilities
 */

export const textFormatters = {
  /**
   * Capitalizes the first letter of a string
   * @param text - The text to capitalize
   * @returns Capitalized text
   */
  capitalize: (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Converts text to title case
   * @param text - The text to convert
   * @returns Title case text
   */
  toTitleCase: (text: string): string => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => textFormatters.capitalize(word))
      .join(' ');
  },

  /**
   * Truncates text to a specified length
   * @param text - The text to truncate
   * @param maxLength - Maximum length
   * @param suffix - Suffix to add when truncated (default: '...')
   * @returns Truncated text
   */
  truncate: (text: string, maxLength: number, suffix = '...'): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.slice(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Removes extra whitespace from text
   * @param text - The text to clean
   * @returns Cleaned text
   */
  cleanWhitespace: (text: string): string => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  },

  /**
   * Converts text to a URL-friendly slug
   * @param text - The text to convert
   * @returns URL slug
   */
  toSlug: (text: string): string => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .trim()
      // Normalize accented characters to their basic form
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace spaces and special characters with hyphens
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Extracts initials from a name
   * @param name - The full name
   * @param maxInitials - Maximum number of initials (default: 2)
   * @returns Initials string
   */
  extractInitials: (name: string, maxInitials = 2): string => {
    if (!name) return '';
    
    const words = name.trim().split(/\s+/);
    const initials = words
      .slice(0, maxInitials)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    return initials;
  },

  /**
   * Masks sensitive text (like email or phone)
   * @param text - The text to mask
   * @param visibleChars - Number of characters to keep visible at start and end
   * @param maskChar - Character to use for masking (default: '*')
   * @returns Masked text
   */
  mask: (text: string, visibleChars = 2, maskChar = '*'): string => {
    if (!text) return '';
    if (text.length <= visibleChars * 2) return text;
    
    const start = text.slice(0, visibleChars);
    const end = text.slice(-visibleChars);
    const middle = maskChar.repeat(Math.max(1, text.length - visibleChars * 2));
    
    return start + middle + end;
  },

  /**
   * Highlights search terms in text
   * @param text - The text to highlight in
   * @param searchTerm - The term to highlight
   * @param highlightClass - CSS class for highlighting (default: 'highlight')
   * @returns Text with highlighted terms
   */
  highlightSearchTerm: (
    text: string,
    searchTerm: string,
    highlightClass = 'highlight'
  ): string => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
  },

  /**
   * Converts line breaks to HTML breaks
   * @param text - The text to convert
   * @returns Text with HTML line breaks
   */
  lineBreaksToHtml: (text: string): string => {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  },

  /**
   * Strips HTML tags from text
   * @param html - The HTML string
   * @returns Plain text
   */
  stripHtml: (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  },

  /**
   * Counts words in text
   * @param text - The text to count
   * @returns Number of words
   */
  wordCount: (text: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  /**
   * Estimates reading time for text
   * @param text - The text to analyze
   * @param wordsPerMinute - Average reading speed (default: 200)
   * @returns Estimated reading time in minutes
   */
  estimateReadingTime: (text: string, wordsPerMinute = 200): number => {
    const words = textFormatters.wordCount(text);
    return Math.ceil(words / wordsPerMinute);
  },
};