import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DataImportService } from './data-import.service';
import { ImportBusinessesDto } from '../google-places/dto/google-places.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@ApiTags('Data Import')
@Controller('data-import')
export class DataImportController {
  constructor(private readonly dataImportService: DataImportService) {}

  @Post('businesses')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Import businesses from Google Places',
    description: 'Import businesses from Google Places API for a specific city and category. Requires authentication.'
  })
  @ApiResponse({
    status: 200,
    description: 'Import completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        imported: { type: 'number' },
        duplicates: { type: 'number' },
        errors: { type: 'number' },
        details: {
          type: 'object',
          properties: {
            created: { type: 'array', items: { type: 'string' } },
            duplicateIds: { type: 'array', items: { type: 'string' } },
            errorMessages: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters or API not configured'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required'
  })
  async importBusinesses(@Body() importDto: ImportBusinessesDto) {
    return this.dataImportService.importBusinesses(
      importDto.city,
      importDto.category,
      importDto.limit,
      importDto.skipDuplicates
    );
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get import statistics',
    description: 'Get statistics about imported businesses'
  })
  @ApiResponse({
    status: 200,
    description: 'Import statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalBusinesses: { type: 'number' },
        businessesByCategory: {
          type: 'object',
          additionalProperties: { type: 'number' }
        },
        businessesByCity: {
          type: 'object',
          additionalProperties: { type: 'number' }
        },
        verifiedBusinesses: { type: 'number' },
        withGooglePlaceId: { type: 'number' }
      }
    }
  })
  async getImportStats() {
    return this.dataImportService.getImportStats();
  }
}