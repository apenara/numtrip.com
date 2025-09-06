import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreatePromoCodeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  description: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  discount: string; // e.g., "20%", "$50", "Free upgrade"

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsage?: number;
}

export class UpdatePromoCodeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  discount?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsage?: number;
}

export class PromoCodeResponseDto {
  id: string;
  code: string;
  description: string;
  discount: string;
  validUntil?: Date;
  active: boolean;
  usageCount: number;
  maxUsage?: number;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}