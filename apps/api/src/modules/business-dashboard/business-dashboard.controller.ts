import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessDashboardService } from './business-dashboard.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { BusinessOwnerGuard } from '../auth/guards/business-owner.guard';
import { Throttle } from '@nestjs/throttler';
import {
  BusinessOverviewDto,
  UpdateBusinessDto,
  ValidationResponseDto
} from './dto/business-dashboard.dto';

@Controller('business-dashboard')
@UseGuards(SupabaseAuthGuard, BusinessOwnerGuard)
export class BusinessDashboardController {
  constructor(private readonly dashboardService: BusinessDashboardService) {}

  /**
   * Get complete business dashboard overview
   */
  @Get(':businessId/overview')
  @HttpCode(HttpStatus.OK)
  async getBusinessOverview(
    @Param('businessId') businessId: string,
    @Request() req: any
  ): Promise<BusinessOverviewDto> {
    const userId = req.user.id;
    return this.dashboardService.getBusinessOverview(businessId, userId);
  }

  /**
   * Update business information
   */
  @Put(':businessId/profile')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 updates per minute
  @HttpCode(HttpStatus.OK)
  async updateBusiness(
    @Param('businessId') businessId: string,
    @Body() updateData: UpdateBusinessDto,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.dashboardService.updateBusiness(businessId, userId, updateData);
  }

  /**
   * Get all validations for the business
   */
  @Get(':businessId/validations')
  @HttpCode(HttpStatus.OK)
  async getBusinessValidations(
    @Param('businessId') businessId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.dashboardService.getBusinessValidations(businessId, userId);
  }

  /**
   * Respond to a validation comment
   */
  @Post(':businessId/validations/respond')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 responses per minute
  @HttpCode(HttpStatus.OK)
  async respondToValidation(
    @Param('businessId') businessId: string,
    @Body() responseData: ValidationResponseDto,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.dashboardService.respondToValidation(businessId, userId, responseData);
  }

  /**
   * Get business metrics and statistics
   */
  @Get(':businessId/metrics')
  @HttpCode(HttpStatus.OK)
  async getBusinessMetrics(
    @Param('businessId') businessId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    const overview = await this.dashboardService.getBusinessOverview(businessId, userId);
    return {
      metrics: overview.metrics,
      stats: overview.stats,
    };
  }

  /**
   * Get recent activity for the business
   */
  @Get(':businessId/activity')
  @HttpCode(HttpStatus.OK)
  async getRecentActivity(
    @Param('businessId') businessId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    const overview = await this.dashboardService.getBusinessOverview(businessId, userId);
    return overview.recentActivity;
  }
}