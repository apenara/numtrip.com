import { MetadataRoute } from 'next'
import { BusinessService } from '@/lib/business.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://numtrip.com'
  const locales = ['es', 'en']

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    // Root pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Homepage in each locale
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })),
    // Search pages
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    // Add business pages
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}/add-business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    // Legal pages
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })),
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })),
  ]

  // Dynamic business pages
  try {
    const businessResult = await BusinessService.searchBusinesses({
      limit: 1000, // Get all businesses for sitemap
      page: 1
    })

    const businessPages: MetadataRoute.Sitemap = []

    businessResult.items.forEach(business => {
      locales.forEach(locale => {
        const slug = BusinessService.generateBusinessSlug(business, locale)
        businessPages.push({
          url: `${baseUrl}/${locale}/business/${slug}`,
          lastModified: new Date(business.updatedAt),
          changeFrequency: 'weekly',
          priority: business.verified ? 0.9 : 0.7,
        })
      })
    })

    return [...staticPages, ...businessPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages if business pages fail
    return staticPages
  }
}