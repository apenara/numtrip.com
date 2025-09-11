/**
 * Simple script to import businesses using Supabase directly
 * This bypasses the Edge Function JWT requirements
 */

import { createClient } from '@supabase/supabase-js';
import { isLandmarkToFilter } from './packages/utils/src/business/landmark-filter';

const SUPABASE_URL = 'https://xvauchcfkrbbpfoszlah.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_8VPgI3gIlboHsJNaFQAh8w_96_GR-Lb';
const GOOGLE_API_KEY = 'AIzaSyA6dSZQqQEyTvzqjIeJv2bJ4hwCX7hCpT0';

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
}

// Map Google Place types to our business categories
const mapToBusinessCategory = (types: string[] = []): string => {
  const typeSet = new Set(types);
  
  if (typeSet.has('lodging') || typeSet.has('rv_park')) return 'HOTEL';
  if (typeSet.has('restaurant') || typeSet.has('meal_takeaway') || typeSet.has('food') || typeSet.has('bar') || typeSet.has('cafe')) return 'RESTAURANT';
  if (typeSet.has('travel_agency') || typeSet.has('tourist_attraction') || typeSet.has('museum')) return 'TOUR';
  if (typeSet.has('taxi_stand') || typeSet.has('bus_station') || typeSet.has('car_rental') || typeSet.has('airport')) return 'TRANSPORT';
  if (typeSet.has('park') || typeSet.has('amusement_park') || typeSet.has('aquarium') || typeSet.has('zoo')) return 'ATTRACTION';
  
  return 'OTHER';
};

// Get search queries for each category
const getCategoryQuery = (category: string, city: string = 'Cartagena, Colombia'): string => {
  const queries = {
    'hotels': `hotels in ${city}`,
    'restaurants': `restaurants in ${city}`,
    'tours': `tourist attractions in ${city}`,
    'transport': `transportation in ${city}`,
    'attractions': `tourist attractions in ${city}`
  };
  
  return queries[category as keyof typeof queries] || `${category} in ${city}`;
};

async function importBusinesses(category: string, limit: number, city: string = 'Cartagena, Colombia') {
  console.log(`🚀 Starting import for category: ${category}, limit: ${limit}, city: ${city}`);
  
  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  const results = {
    imported: 0,
    duplicates: 0,
    errors: 0,
    details: {
      created: [] as string[],
      duplicateIds: [] as string[],
      errorMessages: [] as string[]
    }
  };
  
  try {
    const query = getCategoryQuery(category, city);
    console.log(`🔍 Searching: ${query}`);
    
    // Search Google Places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    console.log('📡 Making Google Places request...');
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.status !== 'OK') {
      throw new Error(`Google Places API error: ${searchData.status} - ${searchData.error_message || 'Unknown error'}`);
    }
    
    console.log(`✅ Found ${searchData.results.length} potential places`);
    
    // Get or create city record
    let cityRecord;
    const { data: existingCity, error: citySelectError } = await supabase
      .from('cities')
      .select('*')
      .eq('name', city)
      .single();
      
    if (citySelectError && citySelectError.code !== 'PGRST116') {
      console.error('❌ Error checking for existing city:', citySelectError);
      throw citySelectError;
    }
      
    if (existingCity) {
      cityRecord = existingCity;
      console.log(`🏙️  Using existing city: ${cityRecord.id}`);
    } else {
      console.log('🆕 Creating new city record...');
      const { data: newCity, error: cityError } = await supabase
        .from('cities')
        .insert({ name: city, country: 'Colombia' })
        .select()
        .single();
        
      if (cityError) {
        console.error('❌ Error creating city:', cityError);
        throw cityError;
      }
      cityRecord = newCity;
      console.log(`✅ Created new city: ${cityRecord.id}`);
    }
    
    // Process each place (up to limit)
    const placesToProcess = searchData.results.slice(0, limit);
    console.log(`📋 Processing ${placesToProcess.length} places...`);
    
    for (let i = 0; i < placesToProcess.length; i++) {
      const place = placesToProcess[i];
      console.log(`\n🔄 Processing ${i + 1}/${placesToProcess.length}: ${place.name}`);
      
      try {
        // Check for duplicates by Google Place ID
        const { data: existingBusiness, error: duplicateError } = await supabase
          .from('businesses')
          .select('id')
          .eq('google_place_id', place.place_id)
          .single();
          
        if (duplicateError && duplicateError.code !== 'PGRST116') {
          console.error('❌ Error checking duplicates:', duplicateError);
          results.errors++;
          results.details.errorMessages.push(`Error checking duplicates for ${place.name}: ${duplicateError.message}`);
          continue;
        }
          
        if (existingBusiness) {
          console.log(`🔄 Duplicate found: ${place.name}`);
          results.duplicates++;
          results.details.duplicateIds.push(existingBusiness.id);
          continue;
        }
        
        // Get place details for more information
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,types,formatted_phone_number,website,rating,user_ratings_total,business_status&key=${GOOGLE_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status !== 'OK') {
          console.error(`❌ Details API error for ${place.name}: ${detailsData.status}`);
          results.errors++;
          results.details.errorMessages.push(`Details API error for ${place.name}: ${detailsData.status}`);
          continue;
        }
        
        const placeDetails = detailsData.result as GooglePlaceResult;
        const businessCategory = mapToBusinessCategory(placeDetails.types);
        
        // Filter out monuments, landmarks, and non-contactable businesses
        if (isLandmarkToFilter(placeDetails.name, undefined, placeDetails.formatted_address)) {
          console.log(`🏛️  Skipping landmark/monument: ${placeDetails.name}`);
          continue;
        }
        
        // Create business record
        const businessData = {
          name: placeDetails.name,
          description: `${businessCategory.toLowerCase()} in ${city}`,
          category: businessCategory,
          address: placeDetails.formatted_address || null,
          city_id: cityRecord.id,
          latitude: placeDetails.geometry?.location.lat ? parseFloat(placeDetails.geometry.location.lat.toString()) : null,
          longitude: placeDetails.geometry?.location.lng ? parseFloat(placeDetails.geometry.location.lng.toString()) : null,
          google_place_id: placeDetails.place_id,
          website: placeDetails.website || null,
          verified: false,
          claimed: false
        };
        
        console.log('💾 Creating business record...');
        const { data: newBusiness, error: businessError } = await supabase
          .from('businesses')
          .insert(businessData)
          .select()
          .single();
          
        if (businessError) {
          console.error(`❌ Error creating business ${placeDetails.name}:`, businessError);
          results.errors++;
          results.details.errorMessages.push(`Error creating business ${placeDetails.name}: ${businessError.message}`);
          continue;
        }
        
        // Add phone contact if available
        if (placeDetails.formatted_phone_number) {
          const { error: contactError } = await supabase
            .from('contacts')
            .insert({
              business_id: newBusiness.id,
              type: 'PHONE',
              value: placeDetails.formatted_phone_number,
              verified: false,
              primary_contact: true
            });
            
          if (contactError) {
            console.error(`⚠️  Error adding phone contact for ${placeDetails.name}:`, contactError);
          } else {
            console.log(`📞 Added phone: ${placeDetails.formatted_phone_number}`);
          }
        }
        
        // Add website contact if available
        if (placeDetails.website) {
          const { error: websiteError } = await supabase
            .from('contacts')
            .insert({
              business_id: newBusiness.id,
              type: 'WEBSITE',
              value: placeDetails.website,
              verified: false,
              primary_contact: false
            });
            
          if (websiteError) {
            console.error(`⚠️  Error adding website contact for ${placeDetails.name}:`, websiteError);
          } else {
            console.log(`🌐 Added website: ${placeDetails.website}`);
          }
        }
        
        console.log(`✅ Successfully imported: ${placeDetails.name}`);
        results.imported++;
        results.details.created.push(newBusiness.id);
        
        // Add delay to respect rate limits (500ms between requests)
        console.log('⏳ Waiting 500ms...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Error processing place ${place.name}:`, error);
        results.errors++;
        results.details.errorMessages.push(`Error processing place ${place.name}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Import function error:', error);
    results.errors++;
    results.details.errorMessages.push(`Import function error: ${error.message}`);
  }
  
  console.log('\n📊 Import Results:');
  console.log(`   ✅ Imported: ${results.imported}`);
  console.log(`   🔄 Duplicates: ${results.duplicates}`);
  console.log(`   ❌ Errors: ${results.errors}`);
  
  if (results.details.errorMessages.length > 0) {
    console.log('\n⚠️  Error Details:');
    results.details.errorMessages.slice(0, 5).forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
    if (results.details.errorMessages.length > 5) {
      console.log(`   ... and ${results.details.errorMessages.length - 5} more errors`);
    }
  }
  
  return results;
}

// Main execution
async function main() {
  console.log('🎯 NumTrip Business Import Tool');
  console.log('================================');
  console.log('');
  
  try {
    // Import by categories with different limits totaling ~500 businesses
    const categories = [
      { name: 'hotels', limit: 100 },
      { name: 'restaurants', limit: 150 },
      { name: 'tours', limit: 80 },
      { name: 'transport', limit: 85 },
      { name: 'attractions', limit: 85 }
    ];
    
    let totalImported = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;
    
    for (const category of categories) {
      console.log(`\n🏗️  Starting ${category.name.toUpperCase()} import...`);
      console.log('=' + '='.repeat(category.name.length + 20));
      
      const result = await importBusinesses(category.name, category.limit);
      
      totalImported += result.imported;
      totalDuplicates += result.duplicates;
      totalErrors += result.errors;
      
      console.log(`\n✅ ${category.name.toUpperCase()} completed: +${result.imported} businesses`);
      
      // Wait 2 seconds between categories
      if (categories.indexOf(category) < categories.length - 1) {
        console.log('⏳ Waiting 2 seconds before next category...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n🎉 FINAL RESULTS');
    console.log('================');
    console.log(`✅ Total Imported: ${totalImported} businesses`);
    console.log(`🔄 Total Duplicates: ${totalDuplicates}`);
    console.log(`❌ Total Errors: ${totalErrors}`);
    console.log('');
    console.log('🚀 Import completed successfully!');
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  main().catch(console.error);
}

export { importBusinesses, main };