import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Landmark filter function to exclude monuments and non-contactable places
const EXCLUDED_LANDMARK_KEYWORDS = [
  'monumento', 'monument', 'estatua', 'statue',
  'plaza', 'parque', 'park', 'malecon', 'camellon',
  'museo', 'museum', 'catedral', 'cathedral', 'iglesia', 'church',
  'basilica', 'convento', 'convent', 'castillo', 'castle',
  'fortaleza', 'fort', 'murallas', 'walls', 'torre', 'tower',
  'puerta', 'gate', 'cementerio',
  'bahia', 'bay', 'muelle', 'puerto', 'port',
  'getsemani', 'getsemaní', 'alcatraces', 'pegasos', 'aduana',
  'india catalina', 'bolivar', 'bolívar', 'santo domingo',
  'los coches', 'san pedro claver', 'santa cruz', 'popa',
  'oro zenu', 'zenú', 'martires', 'mártires', 'oceanos',
  'océanos', 'union', 'unión', 'reloj', 'barajas'
];

function isLandmarkToFilter(
  name: string,
  description?: string | null,
  address?: string | null
): boolean {
  const nameText = name.toLowerCase();
  const descText = (description || '').toLowerCase();
  const addressText = (address || '').toLowerCase();

  return EXCLUDED_LANDMARK_KEYWORDS.some(keyword =>
    nameText.includes(keyword) ||
    descText.includes(keyword) ||
    addressText.includes(keyword)
  );
}

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