import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()

  try {
    // Fetch all businesses with city information
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select(`
        id,
        name,
        verified,
        updated_at,
        cities (
          name
        )
      `)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses for sitemap:', error)
      return new Response('Error generating sitemap', { status: 500 })
    }

    const baseUrl = 'https://numtrip.com'

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${businesses?.map(business => {
  const businessSlug = generateBusinessSlug(business)
  const lastMod = business.updated_at ? new Date(business.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  const priority = business.verified ? '0.9' : '0.7'

  return `  <url>
    <loc>${baseUrl}/es/business/${businessSlug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/business/${businessSlug}" />
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/business/${businessSlug}" />
  </url>
  <url>
    <loc>${baseUrl}/en/business/${businessSlug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/es/business/${businessSlug}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/business/${businessSlug}" />
  </url>`
}).join('')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating businesses sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}

function generateBusinessSlug(business: any): string {
  const nameSlug = business.name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const cityName = business.cities?.name || ''
  const citySlug = cityName ? cityName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') : ''

  const verificationStatus = business.verified ? 'verificado' : 'no-verificado'

  const parts = ['contacto-de', nameSlug]
  if (citySlug) {
    parts.push(citySlug)
  }
  parts.push(verificationStatus)

  return parts.join('-')
}