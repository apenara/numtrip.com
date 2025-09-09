import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BusinessCategory } from '@prisma/client';

export class BusinessSearchDto {
  @ApiProperty({ example: 'hotel', required: false, description: 'Search query for business name or description' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ example: 'Cartagena', required: false, description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ enum: BusinessCategory, required: false, description: 'Filter by business category' })
  @IsOptional()
  @IsEnum(BusinessCategory)
  category?: BusinessCategory;

  @ApiProperty({ example: true, required: false, description: 'Filter by verification status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  verified?: boolean;

  @ApiProperty({ example: 1, required: false, description: 'Page number (starts from 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, description: 'Number of items per page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}