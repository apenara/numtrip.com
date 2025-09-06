import { IsString, IsOptional, IsEmail, IsUrl, IsArray, ValidateNested, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class BusinessMetricsDto {
  profileViews: number;
  contactClicks: number;
  validationCount: number;
  trustScore: number;
  promoCodeUsage: number;
  
  // Time-based metrics
  viewsThisMonth: number;
  viewsLastMonth: number;
  clicksThisMonth: number;
  clicksLastMonth: number;
  
  // Validation metrics
  positiveValidations: number;
  negativeValidations: number;
  validationResponseRate: number;
}

export class BusinessHoursDto {
  @IsString()
  day: string; // monday, tuesday, etc.

  @IsOptional()
  @IsString()
  openTime?: string; // "09:00"

  @IsOptional()
  @IsString()
  closeTime?: string; // "18:00"

  @IsBoolean()
  @IsOptional()
  isClosed?: boolean; // true if closed on this day
}

export class UpdateBusinessDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDto)
  businessHours?: BusinessHoursDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  specialties?: string; // Comma-separated specialties

  @IsOptional()
  @IsString()
  paymentMethods?: string; // Comma-separated payment methods
}

export class BusinessStatsDto {
  totalViews: number;
  totalClicks: number;
  totalValidations: number;
  averageTrustScore: number;
  
  // Recent activity (last 30 days)
  recentViews: number;
  recentClicks: number;
  recentValidations: number;
  
  // Comparison with previous period
  viewsGrowth: number; // percentage
  clicksGrowth: number;
  validationsGrowth: number;
  
  // Top performing metrics
  mostClickedContact: string; // phone, email, whatsapp
  peakViewHour: number; // 0-23
  peakViewDay: string; // monday, tuesday, etc.
}

export class RecentActivityDto {
  id: string;
  type: 'view' | 'click' | 'validation' | 'promo_used';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class BusinessOverviewDto {
  @Type(() => BusinessMetricsDto)
  metrics: BusinessMetricsDto;

  @Type(() => BusinessStatsDto)  
  stats: BusinessStatsDto;

  @Type(() => RecentActivityDto)
  recentActivity: RecentActivityDto[];

  // Business info summary
  businessName: string;
  businessCategory: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  claimedAt: Date;
  
  // Quick actions needed
  actionItems: string[];
  unreadValidations: number;
  expiringSoonPromoCodes: number;
}

export class ValidationResponseDto {
  @IsString()
  validationId: string;

  @IsString()
  response: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean; // Whether response is visible to community
}