import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidationService } from './validation.service';

@ApiTags('Validation')
@Controller('validations')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post(':businessId/validate')
  @ApiOperation({ summary: 'Validate business contact information' })
  @ApiResponse({ status: 201, description: 'Validation recorded successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async validateBusiness(
    @Param('businessId') businessId: string,
    @Body() validationDto: { type: string; isCorrect: boolean; comment?: string }
  ) {
    return this.validationService.validateBusiness(businessId, validationDto);
  }

  @Post(':businessId/report')
  @ApiOperation({ summary: 'Report incorrect business information' })
  @ApiResponse({ status: 201, description: 'Report submitted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async reportBusiness(
    @Param('businessId') businessId: string,
    @Body() reportDto: { type: string; comment: string }
  ) {
    return this.validationService.reportBusiness(businessId, reportDto);
  }
}