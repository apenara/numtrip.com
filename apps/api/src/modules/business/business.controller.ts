import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from './business.service';
import { 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessSearchDto,
  CreatePromoCodeDto,
  UpdatePromoCodeDto,
  PromoCodeResponseDto
} from './dto';

@ApiTags('Business')
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @ApiOperation({ summary: 'Search businesses' })
  @ApiResponse({ status: 200, description: 'List of businesses' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'verified', required: false, description: 'Filter by verification status' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  async searchBusinesses(@Query() searchDto: BusinessSearchDto) {
    return this.businessService.searchBusinesses(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiResponse({ status: 200, description: 'Business details' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessById(@Param('id') id: string) {
    return this.businessService.getBusinessById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBearerAuth()
  async createBusiness(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.createBusiness(createBusinessDto);
  }

  @Post(':id/claim')
  @ApiOperation({ summary: 'Claim business ownership' })
  @ApiResponse({ status: 200, description: 'Business claimed successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 409, description: 'Business already claimed' })
  @ApiBearerAuth()
  async claimBusiness(@Param('id') id: string) {
    return this.businessService.claimBusiness(id);
  }

  // Business Owner Endpoints (require ownership verification)

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update business information (owners only)' })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this business' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 updates per minute
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.businessService.updateBusinessByOwner(id, updateBusinessDto, userId);
  }

  // Promo Code Management Endpoints

  @Post(':id/promo-codes')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create promo code for business (owners only)' })
  @ApiResponse({ status: 201, description: 'Promo code created successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to manage this business' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 promo codes per minute
  async createPromoCode(
    @Param('id') businessId: string,
    @Body() createPromoCodeDto: CreatePromoCodeDto,
    @Request() req: any
  ): Promise<PromoCodeResponseDto> {
    const userId = req.user.id;
    return this.businessService.createPromoCode(businessId, createPromoCodeDto, userId);
  }

  @Get(':id/promo-codes')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all promo codes for business (owners only)' })
  @ApiResponse({ status: 200, description: 'List of promo codes' })
  @ApiResponse({ status: 403, description: 'Not authorized to view this business promo codes' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiBearerAuth()
  async getBusinessPromoCodes(
    @Param('id') businessId: string,
    @Request() req: any
  ): Promise<PromoCodeResponseDto[]> {
    const userId = req.user.id;
    return this.businessService.getBusinessPromoCodes(businessId, userId);
  }

  @Put(':businessId/promo-codes/:promoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update promo code (owners only)' })
  @ApiResponse({ status: 200, description: 'Promo code updated successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to manage this promo code' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiBearerAuth()
  async updatePromoCode(
    @Param('businessId') businessId: string,
    @Param('promoId') promoId: string,
    @Body() updatePromoCodeDto: UpdatePromoCodeDto,
    @Request() req: any
  ): Promise<PromoCodeResponseDto> {
    const userId = req.user.id;
    return this.businessService.updatePromoCode(businessId, promoId, updatePromoCodeDto, userId);
  }

  @Delete(':businessId/promo-codes/:promoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete promo code (owners only)' })
  @ApiResponse({ status: 200, description: 'Promo code deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this promo code' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiBearerAuth()
  async deletePromoCode(
    @Param('businessId') businessId: string,
    @Param('promoId') promoId: string,
    @Request() req: any
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    return this.businessService.deletePromoCode(businessId, promoId, userId);
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get business analytics (owners only)' })
  @ApiResponse({ status: 200, description: 'Business analytics data' })
  @ApiResponse({ status: 403, description: 'Not authorized to view this business analytics' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiBearerAuth()
  async getBusinessAnalytics(
    @Param('id') businessId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.businessService.getBusinessAnalytics(businessId, userId);
  }
}