import { MetadataRoute } from 'next'

export function GET(): Response {
  const robotsTxt = `User-agent: *
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /api/
Disallow: /_next/
Disallow: /favicon.ico

# Allow search engines to index business pages
Allow: /*/business/
Allow: /*/search

# Sitemap
Sitemap: https://numtrip.com/sitemap.xml

# Crawl delay (be respectful)
Crawl-delay: 1`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}