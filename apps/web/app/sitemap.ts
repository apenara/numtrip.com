import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { isLandmarkToFilter } from '@contactos-turisticos/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://numtrip.com';
  const locales = ['es', 'en'];

  const urls: MetadataRoute.Sitemap = [];

  // Add home pages for each locale
  for (const locale of locales) {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Add search page
    urls.push({
      url: `${baseUrl}/${locale}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Add category pages
    const categories = ['HOTEL', 'RESTAURANT', 'TOUR', 'TRANSPORT', 'ATTRACTION', 'OTHER'];
    for (const category of categories) {
      urls.push({
        url: `${baseUrl}/${locale}/search?category=${category.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Fetch all businesses from database
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, name, description, address, updated_at')
    .not('slug', 'is', null)
    .order('created_at', { ascending: false });

  if (businesses) {
    for (const business of businesses) {
      // Filter out landmarks and monuments
      if (isLandmarkToFilter(business.name, business.description, business.address)) {
        continue;
      }

      // Add business pages for each locale
      for (const locale of locales) {
        urls.push({
          url: `${baseUrl}/${locale}/business/${business.slug}`,
          lastModified: new Date(business.updated_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  return urls;
}