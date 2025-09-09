import { ConfigService } from '@nestjs/config';
import { GooglePlacesService } from '../modules/google-places/google-places.service';

/**
 * Script to test and diagnose Google Places API configuration
 * 
 * Usage:
 * pnpm run script:test-google-places
 */

class GooglePlacesDebugger {
  private readonly configService = new ConfigService();
  private readonly googlePlacesService: GooglePlacesService;

  constructor() {
    this.googlePlacesService = new GooglePlacesService(this.configService);
  }

  async run() {
    console.log('🔍 Google Places API Diagnostic Tool');
    console.log('=====================================');
    console.log('');

    // Check API Key configuration
    const apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      console.log('❌ GOOGLE_PLACES_API_KEY not found in environment variables');
      console.log('');
      console.log('💡 Steps to fix:');
      console.log('1. Go to https://console.cloud.google.com/');
      console.log('2. Create or select a project');
      console.log('3. Enable Places API');
      console.log('4. Create API Key');
      console.log('5. Add GOOGLE_PLACES_API_KEY="your-key" to .env file');
      return;
    }

    console.log(`✅ API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
    console.log(`🔢 API Key length: ${apiKey.length} characters`);
    console.log('');

    // Check if service is configured
    const isConfigured = this.googlePlacesService.isConfigured();
    console.log(`📋 Service configured: ${isConfigured ? '✅ Yes' : '❌ No'}`);
    console.log('');

    if (!isConfigured) {
      console.log('❌ GooglePlacesService is not properly configured');
      return;
    }

    // Test simple search
    console.log('🧪 Testing Google Places API...');
    console.log('');

    try {
      // Test with a very simple query
      console.log('1️⃣  Testing basic text search...');
      const simpleResult = await this.googlePlacesService.textSearch({
        query: 'restaurant'
      });

      if (simpleResult.status === 'OK') {
        console.log(`✅ Basic search successful: ${simpleResult.results.length} results`);
      } else {
        console.log(`❌ Basic search failed: ${simpleResult.status}`);
        if (simpleResult.error_message) {
          console.log(`   Error: ${simpleResult.error_message}`);
        }
      }

    } catch (error) {
      console.log(`❌ Basic search failed with exception: ${error.message}`);
      
      if (error.message.includes('403')) {
        console.log('');
        console.log('🚨 HTTP 403 Error - Possible Causes:');
        console.log('');
        console.log('1. 🔐 API Key Issues:');
        console.log('   - API key is invalid or expired');
        console.log('   - API key restrictions are too strict');
        console.log('   - API key doesn\'t have Places API enabled');
        console.log('');
        console.log('2. 💳 Billing Issues:');
        console.log('   - No billing account linked to project');
        console.log('   - Billing account is suspended');
        console.log('   - Daily quota exceeded');
        console.log('');
        console.log('3. 🚫 API Restrictions:');
        console.log('   - IP address restrictions');
        console.log('   - HTTP referrer restrictions');
        console.log('   - API is disabled for the project');
        console.log('');
        console.log('💡 Solutions:');
        console.log('');
        console.log('1. Check Google Cloud Console:');
        console.log('   https://console.cloud.google.com/apis/dashboard');
        console.log('');
        console.log('2. Verify Places API is enabled:');
        console.log('   https://console.cloud.google.com/apis/library/places-backend.googleapis.com');
        console.log('');
        console.log('3. Check API Key settings:');
        console.log('   https://console.cloud.google.com/apis/credentials');
        console.log('');
        console.log('4. Verify billing is enabled:');
        console.log('   https://console.cloud.google.com/billing');
        console.log('');
        console.log('5. Check quotas and usage:');
        console.log('   https://console.cloud.google.com/iam-admin/quotas');
        
        return;
      }

      if (error.message.includes('INVALID_REQUEST')) {
        console.log('');
        console.log('🚨 Invalid Request - API might be working but request is malformed');
      }

      if (error.message.includes('OVER_QUERY_LIMIT')) {
        console.log('');
        console.log('🚨 Query Limit Exceeded - Wait for quota reset or upgrade plan');
      }
    }

    console.log('');
    console.log('2️⃣  Testing location-based search...');

    try {
      // Test location-based search for Cartagena
      const locationResult = await this.googlePlacesService.textSearch({
        query: 'hotel in Cartagena',
        location: '10.3932,-75.4832', // Cartagena coordinates
        radius: 10000 // 10km radius
      });

      if (locationResult.status === 'OK') {
        console.log(`✅ Location search successful: ${locationResult.results.length} results`);
        
        if (locationResult.results.length > 0) {
          const firstResult = locationResult.results[0];
          console.log(`   First result: ${firstResult.name || 'Unknown'}`);
          console.log(`   Address: ${firstResult.formatted_address || 'Unknown'}`);
          console.log(`   Types: ${firstResult.types?.join(', ') || 'Unknown'}`);
        }
      } else {
        console.log(`❌ Location search failed: ${locationResult.status}`);
        if (locationResult.error_message) {
          console.log(`   Error: ${locationResult.error_message}`);
        }
      }

    } catch (error) {
      console.log(`❌ Location search failed: ${error.message}`);
    }

    console.log('');
    console.log('3️⃣  Testing place details...');

    try {
      // We'll use a well-known place ID for testing
      const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Sydney Opera House
      const detailsResult = await this.googlePlacesService.getPlaceDetails(testPlaceId);

      if (detailsResult.status === 'OK') {
        console.log(`✅ Place details successful`);
        console.log(`   Name: ${detailsResult.result.name || 'Unknown'}`);
      } else {
        console.log(`❌ Place details failed: ${detailsResult.status}`);
      }

    } catch (error) {
      console.log(`❌ Place details failed: ${error.message}`);
    }

    console.log('');
    console.log('📊 Diagnostic Complete');
    console.log('');

    if (apiKey && isConfigured) {
      console.log('🎯 Next Steps:');
      console.log('1. If tests pass, try running the import script again');
      console.log('2. If tests fail, follow the troubleshooting steps above');
      console.log('3. Contact support if issues persist');
    }
  }
}

// Script execution
if (require.main === module) {
  const diagnostic = new GooglePlacesDebugger();
  diagnostic.run().catch(console.error);
}