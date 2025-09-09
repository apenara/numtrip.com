import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TextSearchDto {
  @ApiProperty({ 
    description: 'Search query for places',
    example: 'hotels in Cartagena Colombia' 
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({ 
    description: 'Location bias (lat,lng)',
    example: '10.3932,-75.4832' 
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ 
    description: 'Radius in meters',
    example: 50000,
    minimum: 1,
    maximum: 50000 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50000)
  radius?: number;

  @ApiPropertyOptional({ 
    description: 'Place type to filter',
    example: 'lodging' 
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ 
    description: 'Page token for pagination' 
  })
  @IsOptional()
  @IsString()
  pagetoken?: string;
}

export class NearbySearchDto {
  @ApiProperty({ 
    description: 'Center location (lat,lng)',
    example: '10.3932,-75.4832' 
  })
  @IsString()
  location: string;

  @ApiProperty({ 
    description: 'Search radius in meters',
    example: 10000,
    minimum: 1,
    maximum: 50000 
  })
  @IsNumber()
  @Min(1)
  @Max(50000)
  radius: number;

  @ApiPropertyOptional({ 
    description: 'Place type to search for',
    example: 'restaurant' 
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ 
    description: 'Keyword to refine search',
    example: 'tourist' 
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ 
    description: 'Page token for pagination' 
  })
  @IsOptional()
  @IsString()
  pagetoken?: string;
}

export class PlaceDetailsDto {
  @ApiProperty({ 
    description: 'Google Place ID',
    example: 'ChIJN1t_tDeuEmsRUsoyG83frY4' 
  })
  @IsString()
  place_id: string;
}

export enum ImportCategory {
  HOTELS = 'hotels',
  RESTAURANTS = 'restaurants', 
  TOURS = 'tours',
  TRANSPORT = 'transport',
  ATTRACTIONS = 'attractions',
  ALL = 'all'
}

export class ImportBusinessesDto {
  @ApiProperty({ 
    description: 'City to import businesses from',
    example: 'Cartagena, Colombia' 
  })
  @IsString()
  city: string;

  @ApiProperty({ 
    description: 'Category of businesses to import',
    enum: ImportCategory,
    example: ImportCategory.HOTELS 
  })
  @IsEnum(ImportCategory)
  category: ImportCategory;

  @ApiPropertyOptional({ 
    description: 'Maximum number of results to import',
    example: 100,
    minimum: 1,
    maximum: 1000,
    default: 100 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number = 100;

  @ApiPropertyOptional({ 
    description: 'Whether to skip duplicate detection',
    default: false 
  })
  @IsOptional()
  skipDuplicates?: boolean = false;
}