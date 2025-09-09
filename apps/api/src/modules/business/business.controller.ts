import {
  Controller,
  Get,
  Post,
  Put,
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
  BusinessSearchDto
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
    @Body() updateBusinessDto: UpdateBusinessDto
  ) {
    return this.businessService.updateBusiness(id, updateBusinessDto);
  }


  @Get(':id/stats')
  @ApiOperation({ summary: 'Get business stats' })
  @ApiResponse({ status: 200, description: 'Business stats data' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async getBusinessStats(
    @Param('id') businessId: string
  ) {
    return this.businessService.getBusinessStats(businessId);
  }
}