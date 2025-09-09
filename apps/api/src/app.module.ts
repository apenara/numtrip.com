import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { SearchModule } from './modules/search/search.module';
// import { ValidationModule } from './modules/validation/validation.module';
import { ClaimModule } from './modules/claim/claim.module';
import { BusinessDashboardModule } from './modules/business-dashboard/business-dashboard.module';
import { GooglePlacesModule } from './modules/google-places/google-places.module';
import { DataImportModule } from './modules/data-import/data-import.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    DatabaseModule,
    // AuthModule, // Temporarily disabled - needs fixing
    BusinessModule,
    SearchModule,
    // ValidationModule, // Temporarily disabled - needs fixing
    // ClaimModule, // Temporarily disabled - needs fixing
    // BusinessDashboardModule, // Temporarily disabled - needs fixing
    GooglePlacesModule,
    DataImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}