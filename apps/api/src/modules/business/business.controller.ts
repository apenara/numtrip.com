import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
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
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessSearchDto } from './dto';

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
}