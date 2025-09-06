'use client';

import { useEffect, useRef } from 'react';
import { useAdSense } from './GoogleAdSenseProvider';

interface AdSidebarProps {
  slot?: string;
  className?: string;
  sticky?: boolean;
}

export function AdSidebar({ 
  slot,
  className = '',
  sticky = true
}: AdSidebarProps) {
  const { shouldLoadAds, adSenseClientId } = useAdSense();
  const adRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (shouldLoadAds && adRef.current && !hasInitialized.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        hasInitialized.current = true;
      } catch (error) {
        console.warn('AdSense sidebar initialization error:', error);
      }
    }
  }, [shouldLoadAds]);

  if (!shouldLoadAds) {
    // Show placeholder in development
    return (
      <div className={`hidden lg:block ${sticky ? 'sticky top-20' : ''} ${className}`}>
        <div 
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
          style={{ width: '300px', height: '600px' }}
        >
          <div className="text-center text-gray-500 text-sm">
            <div className="mb-2">📱 Publicidad</div>
            <div>AdSense Sidebar</div>
            <div className="text-xs mt-2">300 x 600</div>
            <div className="text-xs">Solo visible en producción</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hidden lg:block ${sticky ? 'sticky top-20' : ''} ${className}`}>
      {/* Ad label */}
      <div className="text-xs text-gray-400 mb-2 text-center">Publicidad</div>
      
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: '300px',
          height: '600px'
        }}
        data-ad-client={adSenseClientId}
        data-ad-slot={slot}
        data-ad-format="auto"
      />
    </div>
  );
}