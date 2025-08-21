import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ValidationType } from '@prisma/client';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateBusiness(
    businessId: string,
    validationDto: { type: string; isCorrect: boolean; comment?: string }
  ) {
    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    // Create validation record
    return this.prisma.validation.create({
      data: {
        businessId,
        type: validationDto.type as ValidationType,
        isCorrect: validationDto.isCorrect,
        comment: validationDto.comment,
        // TODO: Add IP address and user agent from request
      },
    });
  }

  async reportBusiness(
    businessId: string,
    reportDto: { type: string; comment: string }
  ) {
    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    // Create report (validation with isCorrect: false)
    return this.prisma.validation.create({
      data: {
        businessId,
        type: reportDto.type as ValidationType,
        isCorrect: false,
        comment: reportDto.comment,
        // TODO: Add IP address and user agent from request
      },
    });
  }

  async getBusinessValidations(businessId: string) {
    return this.prisma.validation.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Last 50 validations
    });
  }
}