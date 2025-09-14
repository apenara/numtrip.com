import * as fs from 'fs';
import * as path from 'path';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBWZb0LX03BseRBv4U1zXEyvnyvB3lovM0';

if (!GOOGLE_PLACES_API_KEY) {
  console.error('❌ Google Places API key not found');
  process.exit(1);
}

interface Place {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    weekday_text?: string[];
    periods?: any[];
  };
  price_level?: number;
  business_status?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface PlaceSearchResult {
  place_id: string;
  name: string;
  types?: string[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

async function searchPlaces(query: string, type?: string): Promise<PlaceSearchResult[]> {
  const location = '10.3247,-75.5483'; // Tierra Bomba coordinates
  const radius = 5000; // 5km radius to cover the island

  // Try Nearby Search first
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
  url += `location=${location}`;
  url += `&radius=${radius}`;
  if (type) {
    url += `&type=${type}`;
  } else {
    url += `&keyword=${encodeURIComponent(query)}`;
  }
  url += `&key=${GOOGLE_PLACES_API_KEY}`;

  console.log(`🔍 Searching nearby for: ${query}${type ? ` (type: ${type})` : ''}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
      // Fallback to text search
      let textUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
      textUrl += `query=${encodeURIComponent(query)}`;
      textUrl += `&location=${location}`;
      textUrl += `&radius=${radius}`;
      if (type) {
        textUrl += `&type=${type}`;
      }
      textUrl += `&key=${GOOGLE_PLACES_API_KEY}`;

      const textResponse = await fetch(textUrl);
      const textData = await textResponse.json();

      if (textData.status !== 'OK' && textData.status !== 'ZERO_RESULTS') {
        console.error(`API Error: ${textData.status} - ${textData.error_message || ''}`);
        return [];
      }

      return textData.results || [];
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`API Error: ${data.status} - ${data.error_message || ''}`);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error(`Error searching places: ${error}`);
    return [];
  }
}

async function getPlaceDetails(placeId: string): Promise<Place | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${placeId}` +
    `&fields=place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,types,geometry,opening_hours,price_level,business_status,photos` +
    `&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error(`Failed to get details for ${placeId}: ${data.status}`);
      return null;
    }

    return data.result;
  } catch (error) {
    console.error(`Error getting place details: ${error}`);
    return null;
  }
}

async function fetchTierraBombaPlaces() {
  console.log('🏝️ Fetching places in Tierra Bomba, Cartagena...\n');

  const allPlaces: { [category: string]: Place[] } = {
    hotels: [],
    tours_activities: [],
    points_of_interest: [],
    restaurants: [],
    beaches: []
  };

  // Search queries for different categories
  const searches = [
    { query: 'hoteles en Tierra Bomba Cartagena', category: 'hotels', type: 'lodging' },
    { query: 'hotels Tierra Bomba Cartagena', category: 'hotels', type: 'lodging' },
    { query: 'hospedaje Tierra Bomba', category: 'hotels', type: 'lodging' },
    { query: 'tours Tierra Bomba Cartagena', category: 'tours_activities', type: 'travel_agency' },
    { query: 'actividades Tierra Bomba', category: 'tours_activities', type: 'tourist_attraction' },
    { query: 'que hacer en Tierra Bomba', category: 'tours_activities' },
    { query: 'Tierra Bomba tourist attractions', category: 'points_of_interest', type: 'tourist_attraction' },
    { query: 'Fuerte de San Fernando Tierra Bomba', category: 'points_of_interest' },
    { query: 'Playa Punta Arena Tierra Bomba', category: 'beaches' },
    { query: 'restaurantes Tierra Bomba', category: 'restaurants', type: 'restaurant' },
    { query: 'beaches Tierra Bomba', category: 'beaches' },
    { query: 'playas Tierra Bomba', category: 'beaches' }
  ];

  // Collect all unique place IDs to avoid duplicates
  const processedPlaceIds = new Set<string>();

  // Search for places
  for (const search of searches) {
    const results = await searchPlaces(search.query, search.type);
    console.log(`Found ${results.length} results for "${search.query}"`);

    for (const result of results) {
      if (!processedPlaceIds.has(result.place_id)) {
        processedPlaceIds.add(result.place_id);

        // Get detailed information
        const details = await getPlaceDetails(result.place_id);
        if (details) {
          allPlaces[search.category].push(details);
          console.log(`  ✅ ${details.name}`);
        }

        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Delay between searches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save to file
  const outputPath = path.join(__dirname, 'tierra-bomba-places.json');
  const outputData = {
    location: 'Tierra Bomba, Cartagena, Colombia',
    coordinates: {
      lat: 10.3247,
      lng: -75.5483
    },
    fetched_at: new Date().toISOString(),
    total_places: Object.values(allPlaces).reduce((sum, arr) => sum + arr.length, 0),
    categories: allPlaces
  };

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  console.log('\n📊 Summary:');
  console.log(`- Hotels: ${allPlaces.hotels.length}`);
  console.log(`- Tours & Activities: ${allPlaces.tours_activities.length}`);
  console.log(`- Points of Interest: ${allPlaces.points_of_interest.length}`);
  console.log(`- Restaurants: ${allPlaces.restaurants.length}`);
  console.log(`- Beaches: ${allPlaces.beaches.length}`);
  console.log(`\n✅ Data saved to: ${outputPath}`);
}

// Run the script
fetchTierraBombaPlaces().catch(console.error);