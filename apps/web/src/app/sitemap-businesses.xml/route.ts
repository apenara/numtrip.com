import { MetadataRoute } from 'next'
import SupabaseBusinessService from '@/services/business.service.supabase'
import { isLandmarkToFilter } from '@/../../packages/utils/src/business/landmark-filter'

export async function GET(): Promise<Response> {
  const baseUrl = 'https://numtrip.com'
  
  try {
    // Get all businesses for sitemap
    const businesses = await SupabaseBusinessService.searchBusinesses({
      page: 1,
      limit: 10000, // Get all businesses
    })

    // Filter out monuments, landmarks, and non-contactable businesses
    const filteredBusinesses = businesses.items.filter(business => {
      // Include only contactable categories
      const contactableCategories = ['HOTEL', 'RESTAURANT', 'TOUR', 'TRANSPORT'];
      const isContactable = contactableCategories.includes(business.category as string);
      
      // Exclude landmarks/monuments using shared filter function
      const isLandmark = isLandmarkToFilter(business.name, business.description, business.address);
      
      return isContactable && !isLandmark;
    });

    const businessUrls = filteredBusinesses.flatMap(business => {
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

    // Generate XML sitemap with proper hreflang
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${businessUrls.map(({ url, lastModified, changeFrequency, priority }) => {
  const businessSlug = url.split('/').pop();
  const isSpanish = url.includes('/es/');
  const alternateUrl = isSpanish 
    ? url.replace('/es/business/', '/en/business/')
    : url.replace('/en/business/', '/es/business/');
  
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="${isSpanish ? 'es' : 'en'}" href="${url}"/>
    <xhtml:link rel="alternate" hreflang="${isSpanish ? 'en' : 'es'}" href="${alternateUrl}"/>
  </url>`;
}).join('')}
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 minutes cache
      },
    })
  } catch (error) {
    console.error('Error generating business sitemap:', error)
    return new Response('Error generating business sitemap', { status: 500 })
  }
}