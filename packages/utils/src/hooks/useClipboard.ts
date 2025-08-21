import { useState, useCallback } from 'react';

export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 * @param resetDelay - Time in milliseconds before resetting copied state (default: 2000)
 * @returns Object with copy function, copied state, and reset function
 */
export const useClipboard = (resetDelay = 2000): UseClipboardReturn => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      setTimeout(() => setCopied(false), resetDelay);
      
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (result) {
          setCopied(true);
          setTimeout(() => setCopied(false), resetDelay);
          return true;
        }
        
        return false;
      } catch (fallbackError) {
        console.error('Fallback copy method failed:', fallbackError);
        return false;
      }
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return { copy, copied, reset };
};