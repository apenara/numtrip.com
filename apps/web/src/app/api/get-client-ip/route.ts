import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Try to get the real IP from headers (considering proxies/CDNs)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfIP = request.headers.get('cf-connecting-ip'); // Cloudflare
    const vercelIP = request.headers.get('x-vercel-forwarded-for'); // Vercel

    let clientIP = '127.0.0.1'; // fallback

    if (cfIP) {
      clientIP = cfIP;
    } else if (vercelIP) {
      clientIP = vercelIP.split(',')[0].trim();
    } else if (forwarded) {
      clientIP = forwarded.split(',')[0].trim();
    } else if (realIP) {
      clientIP = realIP;
    }

    return NextResponse.json({ 
      ip: clientIP,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting client IP:', error);
    return NextResponse.json(
      { 
        ip: '127.0.0.1', 
        error: 'Failed to determine IP',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}