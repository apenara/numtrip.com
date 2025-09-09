'use client';

import { useEffect, useRef } from 'react';
import { useAdSense } from './GoogleAdSenseProvider';

interface AdInContentProps {
  slot?: string;
  className?: string;
  format?: 'rectangle' | 'horizontal' | 'auto';
}

export function AdInContent({ 
  slot,
  className = '',
  format = 'rectangle'
}: AdInContentProps) {
  const { shouldLoadAds, adSenseClientId } = useAdSense();
  const adRef = useRef<HTMLModElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (shouldLoadAds && adRef.current && !hasInitialized.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        hasInitialized.current = true;
      } catch (error) {
        console.warn('AdSense in-content initialization error:', error);
      }
    }
  }, [shouldLoadAds]);

  if (!shouldLoadAds) {
    // Show placeholder in development
    const dimensions = format === 'rectangle' ? { width: '336px', height: '280px' } :
                     format === 'horizontal' ? { width: '728px', height: '90px' } :
                     { width: '100%', height: '250px' };

    return (
      <div className={`flex justify-center my-8 ${className}`}>
        <div 
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
          style={dimensions}
        >
          <div className="text-center text-gray-500 text-sm">
            <div className="mb-1">📱 Publicidad</div>
            <div>AdSense In-Content</div>
            <div className="text-xs mt-1">{format}</div>
            <div className="text-xs">Solo visible en producción</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <div className="text-center">
        {/* Ad label */}
        <div className="text-xs text-gray-400 mb-2">Publicidad</div>
        
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ 
            display: 'block',
            textAlign: 'center'
          }}
          data-ad-client={adSenseClientId}
          data-ad-slot={slot}
          data-ad-format={format === 'auto' ? 'auto' : format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}