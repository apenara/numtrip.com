import { MetadataRoute } from 'next'

export function GET(): Response {
  const robotsTxt = `# Googlebot specific rules (prioritize Google indexing)
User-agent: Googlebot
Allow: /
Allow: /es/
Allow: /en/
Allow: /*/business/
Allow: /*/search
Allow: /*/contact
Allow: /*/cookie-preferences
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 0

# All other bots
User-agent: *
Allow: /
Allow: /es/
Allow: /en/
Allow: /*/business/
Allow: /*/search
Allow: /*/contact
Allow: /*/cookie-preferences

# Block admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /api/
Disallow: /_next/
Disallow: /favicon.ico

# Sitemaps
Sitemap: https://numtrip.com/sitemap.xml
Sitemap: https://numtrip.com/sitemap-index.xml

# No crawl delay for important bots
User-agent: Bingbot
Crawl-delay: 0

User-agent: Slurp
Crawl-delay: 0

# Slower crawl for less important bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}