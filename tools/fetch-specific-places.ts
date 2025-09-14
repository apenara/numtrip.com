import * as fs from 'fs';
import * as path from 'path';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBWZb0LX03BseRBv4U1zXEyvnyvB3lovM0';

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
  editorial_summary?: {
    overview?: string;
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
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
  formatted_address?: string;
  rating?: number;
}

// Lista de lugares específicos a buscar
const targetPlaces = [
  { searchName: 'Namaste Beach Cartagena', displayName: 'Namaste' },
  { searchName: 'Eteka Beach Cartagena', displayName: 'Eteka' },
  { searchName: 'Fenix Beach Club Cartagena', displayName: 'Fénix' },
  { searchName: 'Makani Beach Club Cartagena', displayName: 'Makani' },
  { searchName: 'Anaho Beach Club Cartagena', displayName: 'Anaho' },
  { searchName: 'Blue Apple Beach Cartagena', displayName: 'Blue Apple' },
  { searchName: 'Ancestral Lounge Beach Club Cartagena', displayName: 'Ancestral Lounge Beach Club' },
  { searchName: 'Baia Bella Beach Club Cartagena', displayName: 'Baia Bella Beach Club' },
  { searchName: 'Amare Beach Club Cartagena', displayName: 'Amare Beach Club' },
  { searchName: 'Atolon Beach Club Cartagena', displayName: 'Atolon Beach Club' },
  { searchName: 'Palmarito Beach Cartagena', displayName: 'Palmarito' },
  { searchName: 'Marianas Beach Club Cartagena', displayName: 'Marianas Beach Club' },
  { searchName: 'Vista Mare Beach Club Cartagena', displayName: 'Vista Mare Beach Club' }
];

async function searchPlace(query: string): Promise<PlaceSearchResult | null> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `query=${encodeURIComponent(query)}` +
    `&region=co` +
    `&key=${GOOGLE_PLACES_API_KEY}`;

  console.log(`🔍 Buscando: ${query}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      // Return the first result (most relevant)
      return data.results[0];
    } else {
      console.log(`   ⚠️ No se encontraron resultados para: ${query}`);
      return null;
    }
  } catch (error) {
    console.error(`   ❌ Error buscando ${query}:`, error);
    return null;
  }
}

async function getPlaceDetails(placeId: string): Promise<Place | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${placeId}` +
    `&fields=place_id,name,formatted_address,formatted_phone_number,international_phone_number,` +
    `website,rating,user_ratings_total,types,geometry,opening_hours,price_level,business_status,` +
    `photos,editorial_summary,reviews` +
    `&language=es` +
    `&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    } else {
      console.error(`   ❌ Error obteniendo detalles: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`   ❌ Error obteniendo detalles del lugar:`, error);
    return null;
  }
}

async function fetchSpecificPlaces() {
  console.log('🏖️ Buscando lugares específicos en Cartagena...\n');

  const foundPlaces: Place[] = [];
  const notFoundPlaces: string[] = [];

  for (const target of targetPlaces) {
    // Search for the place
    const searchResult = await searchPlace(target.searchName);

    if (searchResult) {
      console.log(`   ✅ Encontrado: ${searchResult.name}`);

      // Get detailed information
      const details = await getPlaceDetails(searchResult.place_id);

      if (details) {
        // Add our display name to the details
        (details as any).customDisplayName = target.displayName;
        foundPlaces.push(details);
        console.log(`   📍 Detalles obtenidos: ${details.formatted_address}`);
      } else {
        // If we can't get details, at least save the search result
        const basicPlace: Place = {
          place_id: searchResult.place_id,
          name: searchResult.name,
          formatted_address: searchResult.formatted_address,
          geometry: searchResult.geometry,
          rating: searchResult.rating,
          types: searchResult.types
        };
        (basicPlace as any).customDisplayName = target.displayName;
        foundPlaces.push(basicPlace);
      }
    } else {
      notFoundPlaces.push(target.displayName);
    }

    // Delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Sort places by name
  foundPlaces.sort((a, b) => a.name.localeCompare(b.name));

  // Save to file
  const outputData = {
    search_date: new Date().toISOString(),
    location: 'Cartagena, Colombia',
    total_requested: targetPlaces.length,
    total_found: foundPlaces.length,
    places: foundPlaces,
    not_found: notFoundPlaces
  };

  const outputPath = path.join(__dirname, 'specific-places-cartagena.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  console.log('\n📊 Resumen:');
  console.log(`- Lugares solicitados: ${targetPlaces.length}`);
  console.log(`- Lugares encontrados: ${foundPlaces.length}`);
  if (notFoundPlaces.length > 0) {
    console.log(`- No encontrados: ${notFoundPlaces.join(', ')}`);
  }
  console.log(`\n✅ Datos guardados en: ${outputPath}`);

  // Also create a summary CSV
  const csvPath = path.join(__dirname, 'specific-places-summary.csv');
  const csvHeader = 'Nombre,Dirección,Teléfono,WhatsApp,Website,Rating,Reseñas,Latitud,Longitud\n';
  const csvRows = foundPlaces.map(place => {
    const phone = place.formatted_phone_number || place.international_phone_number || '';
    const whatsapp = phone.replace(/[\s\+\-]/g, '');
    return [
      `"${place.name}"`,
      `"${place.formatted_address || ''}"`,
      `"${phone}"`,
      `"${whatsapp ? '+' + whatsapp : ''}"`,
      `"${place.website || ''}"`,
      place.rating || '',
      place.user_ratings_total || '',
      place.geometry?.location?.lat || '',
      place.geometry?.location?.lng || ''
    ].join(',');
  }).join('\n');

  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`📄 Resumen CSV guardado en: ${csvPath}`);
}

// Run the script
fetchSpecificPlaces().catch(console.error);