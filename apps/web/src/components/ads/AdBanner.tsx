'use client';

import { useEffect, useRef } from 'react';
import { useAdSense } from './GoogleAdSenseProvider';

interface AdBannerProps {
  slot?: string;
  className?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  style?: React.CSSProperties;
}

export function AdBanner({ 
  slot,
  className = '',
  format = 'auto',
  responsive = true,
  style 
}: AdBannerProps) {
  const { shouldLoadAds, adSenseClientId } = useAdSense();
  const adRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (shouldLoadAds && adRef.current && !hasInitialized.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        hasInitialized.current = true;
      } catch (error) {
        console.warn('AdSense banner initialization error:', error);
      }
    }
  }, [shouldLoadAds]);

  if (!shouldLoadAds) {
    // Show placeholder in development or when ads are disabled
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: '90px', ...style }}
      >
        <div className="text-center text-gray-500 text-sm">
          <div className="mb-1">📱 Publicidad</div>
          <div>AdSense Banner</div>
          <div className="text-xs mt-1">Solo visible en producción</div>
        </div>
      </div>
    );
  }

  const adStyle = {
    display: 'block',
    ...style
  };

  return (
    <div className={`text-center ${className}`}>
      {/* Ad label for transparency */}
      <div className="text-xs text-gray-400 mb-1">Publicidad</div>
      
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={adSenseClientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}