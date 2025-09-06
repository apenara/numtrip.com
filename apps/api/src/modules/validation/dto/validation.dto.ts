import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidationType } from '@prisma/client';

export class CreateValidationDto {
  @ApiProperty({
    enum: ValidationType,
    description: 'Type of validation being performed'
  })
  @IsEnum(ValidationType)
  type: ValidationType;

  @ApiProperty({
    description: 'Whether the contact information is correct'
  })
  @IsBoolean()
  isCorrect: boolean;

  @ApiPropertyOptional({
    description: 'Optional comment about the validation'
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class ValidationStatsDto {
  @ApiProperty({ description: 'Business ID' })
  businessId: string;

  @ApiProperty({ description: 'Total number of validations' })
  totalValidations: number;

  @ApiProperty({ description: 'Number of positive validations' })
  positiveValidations: number;

  @ApiProperty({ description: 'Number of negative validations' })
  negativeValidations: number;

  @ApiProperty({ description: 'Overall validation percentage (0-100)' })
  validationPercentage: number;

  @ApiProperty({ description: 'Validation breakdown by contact type' })
  byType: {
    phone: {
      total: number;
      positive: number;
      negative: number;
      percentage: number;
    };
    email: {
      total: number;
      positive: number;
      negative: number;
      percentage: number;
    };
    whatsapp: {
      total: number;
      positive: number;
      negative: number;
      percentage: number;
    };
    general: {
      total: number;
      positive: number;
      negative: number;
      percentage: number;
    };
  };

  @ApiProperty({ description: 'Trust level based on validations' })
  trustLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED';

  @ApiProperty({ description: 'Last validation timestamp' })
  lastValidation: Date | null;
}

export class ValidationHistoryQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    minimum: 1
  })
  @Transform(({ value }) => parseInt(value) || 1)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (default: 10, max: 50)',
    minimum: 1,
    maximum: 50
  })
  @Transform(({ value }) => Math.min(parseInt(value) || 10, 50))
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: ValidationType,
    description: 'Filter by validation type'
  })
  @IsEnum(ValidationType)
  @IsOptional()
  type?: ValidationType;
}

export class UserValidationStatsDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Total validations made by user' })
  totalValidations: number;

  @ApiProperty({ description: 'Helpful validations (agreed with majority)' })
  helpfulValidations: number;

  @ApiProperty({ description: 'User reputation score (0-100)' })
  reputationScore: number;

  @ApiProperty({ description: 'User level based on activity' })
  userLevel: 'NOVATO' | 'EXPERTO' | 'SUPER_VALIDADOR';

  @ApiProperty({ description: 'Points earned from validations' })
  points: number;

  @ApiProperty({ description: 'Badges earned by user' })
  badges: string[];
}