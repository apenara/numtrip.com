#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

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

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_API_URL = 'https://api.indexnow.org/indexnow';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://numtrip.com';

if (!INDEXNOW_KEY) {
  console.error('Error: INDEXNOW_KEY not found in environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

async function submitToIndexNow(urls: string[]): Promise<void> {
  const host = new URL(SITE_URL).hostname;
  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

  const payload: IndexNowPayload = {
    host,
    key: INDEXNOW_KEY!,
    keyLocation,
    urlList: urls,
  };

  try {
    const response = await fetch(INDEXNOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`IndexNow submission failed (${response.status}):`, errorText);

      switch (response.status) {
        case 400:
          console.error('Invalid request format');
          break;
        case 403:
          console.error('Invalid IndexNow key');
          break;
        case 422:
          console.error('URLs do not match the host');
          break;
        case 429:
          console.error('Too many requests - rate limited');
          break;
      }
    } else {
      console.log(`✅ Successfully submitted ${urls.length} URLs to IndexNow`);
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
  }
}

async function generateAndSubmitUrls() {
  const locales = ['es', 'en'];
  const batchSize = 100; // IndexNow recommended batch size
  let allUrls: string[] = [];

  console.log('🔄 Generating URLs for IndexNow submission...');

  // Add home and search pages
  for (const locale of locales) {
    allUrls.push(`${SITE_URL}/${locale}`);
    allUrls.push(`${SITE_URL}/${locale}/search`);

    // Add category pages
    const categories = ['hotel', 'restaurant', 'tour', 'transport', 'attraction', 'other'];
    for (const category of categories) {
      allUrls.push(`${SITE_URL}/${locale}/search?category=${category}`);
    }
  }

  // Fetch businesses
  console.log('📊 Fetching businesses from database...');
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('slug, name, description, address')
    .not('slug', 'is', null);

  if (error) {
    console.error('Error fetching businesses:', error);
    return;
  }

  console.log(`Found ${businesses?.length || 0} businesses`);

  if (businesses) {
    let filteredCount = 0;
    for (const business of businesses) {
      // Filter out landmarks and monuments
      if (isLandmarkToFilter(business.name, business.description, business.address)) {
        filteredCount++;
        continue;
      }

      // Add business URLs for each locale
      for (const locale of locales) {
        allUrls.push(`${SITE_URL}/${locale}/business/${business.slug}`);
      }
    }
    console.log(`Filtered out ${filteredCount} landmarks/monuments`);
  }

  console.log(`📝 Total URLs to submit: ${allUrls.length}`);

  // Submit URLs in batches
  for (let i = 0; i < allUrls.length; i += batchSize) {
    const batch = allUrls.slice(i, i + batchSize);
    console.log(`Submitting batch ${Math.floor(i / batchSize) + 1} (${batch.length} URLs)...`);
    await submitToIndexNow(batch);

    // Add delay between batches to avoid rate limiting
    if (i + batchSize < allUrls.length) {
      console.log('Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('✨ IndexNow submission complete!');
}

// Run the script
generateAndSubmitUrls().catch(console.error);