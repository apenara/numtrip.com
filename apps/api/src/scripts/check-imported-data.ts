import { PrismaService } from '../database/prisma.service';

/**
 * Script to check imported business data
 * 
 * Usage:
 * pnpm run script:check-imported-data
 */

class DataChecker {
  private readonly prisma = new PrismaService();

  async run() {
    console.log('📊 Checking Imported Business Data');
    console.log('==================================');
    console.log('');

    try {
      await this.prisma.onModuleInit();

      // Get all businesses with Google Place ID (imported ones)
      const importedBusinesses = await this.prisma.business.findMany({
        where: {
          googlePlaceId: {
            not: null
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`🏢 Total Imported Businesses: ${importedBusinesses.length}`);
      console.log('');

      if (importedBusinesses.length === 0) {
        console.log('❌ No businesses with Google Place ID found');
        console.log('💡 Run the import script first: pnpm run script:import-cartagena');
        return;
      }

      // Group by category
      const byCategory = importedBusinesses.reduce((acc, business) => {
        acc[business.category] = (acc[business.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('📈 By Category:');
      Object.entries(byCategory).forEach(([category, count]) => {
        console.log(`   ${category}: ${count}`);
      });
      console.log('');

      // Group by city
      const byCity = importedBusinesses.reduce((acc, business) => {
        acc[business.city] = (acc[business.city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('🌍 By City:');
      Object.entries(byCity).forEach(([city, count]) => {
        console.log(`   ${city}: ${count}`);
      });
      console.log('');

      // Show recent imports
      console.log('🕐 Recently Imported (Latest 10):');
      importedBusinesses.slice(0, 10).forEach((business, index) => {
        console.log(`${index + 1}. ${business.name}`);
        console.log(`   📍 ${business.address || 'No address'}`);
        console.log(`   🏷️  Category: ${business.category}`);
        console.log(`   🆔 Google Place ID: ${business.googlePlaceId}`);
        console.log(`   🌐 Website: ${business.website || 'None'}`);
        console.log(`   📞 Phone: ${business.phone || 'None'}`);
        console.log(`   📊 Coordinates: ${business.latitude}, ${business.longitude}`);
        console.log(`   📅 Created: ${business.createdAt.toLocaleString()}`);
        console.log('');
      });

      // Database location info
      console.log('💾 Database Information:');
      console.log(`   Connection: PostgreSQL at localhost:5432`);
      console.log(`   Database: contactos_turisticos`);
      console.log(`   Table: businesses`);
      console.log('');

      // Access instructions
      console.log('🔧 Access Your Data:');
      console.log('');
      console.log('1. 📊 Prisma Studio (Visual Database Browser):');
      console.log('   cd apps/api && pnpm prisma studio');
      console.log('   Opens at: http://localhost:5555');
      console.log('');
      console.log('2. 🗃️  Direct PostgreSQL:');
      console.log('   psql postgresql://username:password@localhost:5432/contactos_turisticos');
      console.log('   Query: SELECT * FROM businesses WHERE "googlePlaceId" IS NOT NULL;');
      console.log('');
      console.log('3. 🌐 API Endpoints:');
      console.log('   GET http://localhost:3001/api/v1/businesses');
      console.log('   GET http://localhost:3001/api/v1/data-import/stats');

    } catch (error) {
      console.error('❌ Error checking data:', error.message);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Script execution
if (require.main === module) {
  const checker = new DataChecker();
  checker.run().catch(console.error);
}