import { Controller, Post, Get, Body, Param, Query, UseGuards, Request, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ValidationService } from './validation.service';
import { CreateValidationDto, ValidationStatsDto, ValidationHistoryQueryDto } from './dto/validation.dto';

@ApiTags('Validation')
@Controller('validations')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post(':businessId/validate')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 validations per minute
  @ApiOperation({ summary: 'Validate business contact information' })
  @ApiResponse({ status: 201, description: 'Validation recorded successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async validateBusiness(
    @Param('businessId') businessId: string,
    @Body() validationDto: CreateValidationDto,
    @Ip() ipAddress: string,
    @Request() req?: any
  ) {
    const userId = req?.user?.id;
    return this.validationService.validateBusiness(businessId, validationDto, ipAddress, userId);
  }

  @Post(':businessId/report')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 reports per minute
  @ApiOperation({ summary: 'Report incorrect business information' })
  @ApiResponse({ status: 201, description: 'Report submitted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async reportBusiness(
    @Param('businessId') businessId: string,
    @Body() reportDto: { type: string; comment: string },
    @Ip() ipAddress: string,
    @Request() req?: any
  ) {
    const userId = req?.user?.id;
    return this.validationService.reportBusiness(businessId, reportDto, ipAddress, userId);
  }

  @Get(':businessId/stats')
  @ApiOperation({ summary: 'Get validation statistics for a business' })
  @ApiResponse({ status: 200, description: 'Validation statistics retrieved successfully', type: ValidationStatsDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getValidationStats(
    @Param('businessId') businessId: string
  ) {
    return this.validationService.getValidationStats(businessId);
  }

  @Get(':businessId/history')
  @ApiOperation({ summary: 'Get validation history for a business' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10, max: 50)' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by validation type' })
  @ApiResponse({ status: 200, description: 'Validation history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getValidationHistory(
    @Param('businessId') businessId: string,
    @Query() query: ValidationHistoryQueryDto
  ) {
    return this.validationService.getValidationHistory(businessId, query);
  }

  @Get('user/stats')
  @ApiOperation({ summary: 'Get validation statistics for current user' })
  @ApiResponse({ status: 200, description: 'User validation statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserValidationStats(
    @Request() req: any
  ) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.validationService.getUserValidationStats(userId);
  }
}