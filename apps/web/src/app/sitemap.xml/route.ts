import { MetadataRoute } from 'next'
import SupabaseBusinessService from '@/services/business.service.supabase'

export async function GET(): Promise<Response> {
  const baseUrl = 'https://numtrip.com'
  
  try {
    // Get all businesses for sitemap
    const businesses = await SupabaseBusinessService.searchBusinesses({
      page: 1,
      limit: 10000, // Get all businesses
    })

    const businessUrls = businesses.items.flatMap(business => {
      // Generate SEO-friendly slugs for both languages
      const spanishSlug = SupabaseBusinessService.generateBusinessSlug(business, 'es');
      const englishSlug = SupabaseBusinessService.generateBusinessSlug(business, 'en');
      
      return [
        // Spanish version
        {
          url: `${baseUrl}/es/business/${spanishSlug}`,
          lastModified: new Date(business.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: business.verified ? 0.9 : 0.7,
        },
        // English version
        {
          url: `${baseUrl}/en/business/${englishSlug}`,
          lastModified: new Date(business.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: business.verified ? 0.9 : 0.7,
        }
      ];
    })

    const staticUrls = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/es`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/en`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/es/search`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/en/search`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/es/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/en/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/es/cookie-preferences`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/en/cookie-preferences`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
    ]

    const allUrls = [...staticUrls, ...businessUrls]

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map(({ url, lastModified, changeFrequency, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}