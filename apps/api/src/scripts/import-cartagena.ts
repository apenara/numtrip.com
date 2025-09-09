import { ConfigService } from '@nestjs/config';
import { GooglePlacesService } from '../modules/google-places/google-places.service';
import { DataImportService } from '../modules/data-import/data-import.service';
import { PrismaService } from '../database/prisma.service';
import { ImportCategory } from '../modules/google-places/dto/google-places.dto';

/**
 * Script to import initial businesses from Google Places for Cartagena, Colombia
 * 
 * Usage:
 * npm run script:import-cartagena
 * 
 * OR with specific parameters:
 * CATEGORY=hotels LIMIT=50 npm run script:import-cartagena
 */

class CartagenaImporter {
  private readonly prisma = new PrismaService();
  private readonly configService = new ConfigService();
  private readonly googlePlacesService: GooglePlacesService;
  private readonly dataImportService: DataImportService;

  constructor() {
    this.googlePlacesService = new GooglePlacesService(this.configService);
    this.dataImportService = new DataImportService(this.prisma, this.googlePlacesService);
  }

  async run() {
    const city = 'Cartagena, Colombia';
    
    // Get parameters from environment or use defaults
    const categoryParam = process.env.CATEGORY?.toLowerCase() || 'all';
    const limitParam = parseInt(process.env.LIMIT || '100');
    
    console.log('🚀 Starting Cartagena business import...');
    console.log(`📍 City: ${city}`);
    console.log(`🏷️  Category: ${categoryParam}`);
    console.log(`🔢 Limit: ${limitParam}`);
    console.log('');

    // Check if Google Places API is configured
    if (!this.googlePlacesService.isConfigured()) {
      console.error('❌ Google Places API key not configured!');
      console.error('Please set GOOGLE_PLACES_API_KEY in your .env file');
      process.exit(1);
    }

    try {
      // Show current database stats
      await this.showCurrentStats();
      console.log('');

      if (categoryParam === 'all') {
        // Import all categories
        await this.importAllCategories(city, limitParam);
      } else {
        // Import specific category
        const category = this.mapCategoryString(categoryParam);
        await this.importCategory(city, category, limitParam);
      }

      // Show final stats
      console.log('');
      console.log('📊 Final Statistics:');
      await this.showCurrentStats();

    } catch (error) {
      console.error('❌ Import failed:', error.message);
      console.error(error.stack);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async importAllCategories(city: string, totalLimit: number) {
    const categories = [
      ImportCategory.HOTELS,
      ImportCategory.RESTAURANTS, 
      ImportCategory.TOURS,
      ImportCategory.TRANSPORT,
      ImportCategory.ATTRACTIONS
    ];

    const limitPerCategory = Math.floor(totalLimit / categories.length);
    
    console.log(`📋 Importing ${limitPerCategory} businesses per category...`);
    console.log('');

    for (const category of categories) {
      await this.importCategory(city, category, limitPerCategory);
      console.log('');
      
      // Add delay between categories to respect rate limits
      console.log('⏳ Waiting 5 seconds before next category...');
      await this.delay(5000);
    }
  }

  private async importCategory(city: string, category: ImportCategory, limit: number) {
    console.log(`🔄 Importing ${category}...`);
    
    const startTime = Date.now();
    
    try {
      const result = await this.dataImportService.importBusinesses(
        city,
        category,
        limit,
        false // Don't skip duplicate detection
      );

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (result.success) {
        console.log(`✅ ${category} import completed in ${duration}s`);
        console.log(`   📈 Imported: ${result.imported}`);
        console.log(`   🔄 Duplicates: ${result.duplicates}`);
        console.log(`   ❌ Errors: ${result.errors}`);
        
        if (result.details.errorMessages.length > 0) {
          console.log('   📝 Error details:');
          result.details.errorMessages.slice(0, 3).forEach(error => {
            console.log(`      - ${error}`);
          });
          if (result.details.errorMessages.length > 3) {
            console.log(`      ... and ${result.details.errorMessages.length - 3} more errors`);
          }
        }
      } else {
        console.log(`❌ ${category} import failed`);
        console.log(`   ❌ Errors: ${result.errors}`);
        result.details.errorMessages.slice(0, 5).forEach(error => {
          console.log(`      - ${error}`);
        });
      }
    } catch (error) {
      console.error(`❌ ${category} import failed:`, error.message);
    }
  }

  private async showCurrentStats() {
    try {
      const stats = await this.dataImportService.getImportStats();
      
      console.log('📊 Database Statistics:');
      console.log(`   Total businesses: ${stats.totalBusinesses}`);
      console.log(`   Verified: ${stats.verifiedBusinesses}`);
      console.log(`   With Google Place ID: ${stats.withGooglePlaceId}`);
      console.log('');
      
      console.log('   By Category:');
      Object.entries(stats.businessesByCategory).forEach(([category, count]) => {
        console.log(`     ${category}: ${count}`);
      });
      console.log('');
      
      console.log('   By City:');
      Object.entries(stats.businessesByCity).forEach(([city, count]) => {
        console.log(`     ${city}: ${count}`);
      });
      
    } catch (error) {
      console.error('Failed to get stats:', error.message);
    }
  }

  private mapCategoryString(categoryStr: string): ImportCategory {
    const mapping: Record<string, ImportCategory> = {
      'hotels': ImportCategory.HOTELS,
      'hotel': ImportCategory.HOTELS,
      'accommodation': ImportCategory.HOTELS,
      'restaurants': ImportCategory.RESTAURANTS,
      'restaurant': ImportCategory.RESTAURANTS,
      'food': ImportCategory.RESTAURANTS,
      'tours': ImportCategory.TOURS,
      'tour': ImportCategory.TOURS,
      'tourist': ImportCategory.TOURS,
      'transport': ImportCategory.TRANSPORT,
      'transportation': ImportCategory.TRANSPORT,
      'taxi': ImportCategory.TRANSPORT,
      'attractions': ImportCategory.ATTRACTIONS,
      'attraction': ImportCategory.ATTRACTIONS,
      'tourist_attraction': ImportCategory.ATTRACTIONS,
      'all': ImportCategory.ALL
    };

    return mapping[categoryStr] || ImportCategory.ALL;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Script execution
if (require.main === module) {
  const importer = new CartagenaImporter();
  importer.run().catch(console.error);
}