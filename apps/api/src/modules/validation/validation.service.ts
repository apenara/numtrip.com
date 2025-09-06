import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ValidationType } from '@prisma/client';
import { CreateValidationDto, ValidationStatsDto, ValidationHistoryQueryDto, UserValidationStatsDto } from './dto/validation.dto';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateBusiness(
    businessId: string,
    validationDto: CreateValidationDto,
    ipAddress: string,
    userId?: string
  ) {
    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    // Check for cooldown (24 hours) to prevent spam
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingValidation = await this.prisma.validation.findFirst({
      where: {
        businessId,
        type: validationDto.type,
        createdAt: { gte: oneDayAgo },
        ...(userId ? { userId } : { ipAddress }),
      },
    });

    if (existingValidation) {
      throw new ConflictException(
        'You can only validate the same contact type once per 24 hours'
      );
    }

    // Create validation record
    return this.prisma.validation.create({
      data: {
        businessId,
        type: validationDto.type,
        isCorrect: validationDto.isCorrect,
        comment: validationDto.comment,
        ipAddress,
        userId,
      },
    });
  }

  async reportBusiness(
    businessId: string,
    reportDto: { type: string; comment: string },
    ipAddress: string,
    userId?: string
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
        ipAddress,
        userId,
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

  async getValidationStats(businessId: string): Promise<ValidationStatsDto> {
    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    // Get all validations for the business
    const validations = await this.prisma.validation.findMany({
      where: { businessId },
    });

    const totalValidations = validations.length;
    const positiveValidations = validations.filter(v => v.isCorrect).length;
    const negativeValidations = totalValidations - positiveValidations;
    const validationPercentage = totalValidations > 0 ? 
      Math.round((positiveValidations / totalValidations) * 100) : 0;

    // Group by type and calculate stats
    const typeStats = this.calculateTypeStats(validations);

    // Determine trust level
    const trustLevel = this.calculateTrustLevel(validationPercentage, totalValidations);

    // Get last validation
    const lastValidation = validations.length > 0 ? 
      validations.reduce((latest, current) => 
        current.createdAt > latest.createdAt ? current : latest
      ).createdAt : null;

    return {
      businessId,
      totalValidations,
      positiveValidations,
      negativeValidations,
      validationPercentage,
      byType: typeStats,
      trustLevel,
      lastValidation,
    };
  }

  async getValidationHistory(businessId: string, query: ValidationHistoryQueryDto) {
    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const where = {
      businessId,
      ...(type && { type }),
    };

    const [validations, total] = await Promise.all([
      this.prisma.validation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          isCorrect: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              // Note: Remove personal info for privacy
            },
          },
        },
      }),
      this.prisma.validation.count({ where }),
    ]);

    return {
      data: validations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserValidationStats(userId: string): Promise<UserValidationStatsDto> {
    const validations = await this.prisma.validation.findMany({
      where: { userId },
    });

    const totalValidations = validations.length;
    
    // Calculate helpful validations (simplified - in real app, compare with majority opinion)
    const helpfulValidations = Math.round(totalValidations * 0.85); // Placeholder logic
    
    const reputationScore = totalValidations > 0 ? 
      Math.min(Math.round((helpfulValidations / totalValidations) * 100), 100) : 0;
    
    const points = totalValidations * 10 + helpfulValidations * 5;
    
    const userLevel = this.calculateUserLevel(totalValidations);
    const badges = this.calculateUserBadges(totalValidations, helpfulValidations);

    return {
      userId,
      totalValidations,
      helpfulValidations,
      reputationScore,
      userLevel,
      points,
      badges,
    };
  }

  private calculateTypeStats(validations: any[]) {
    const phoneValidations = validations.filter(v => 
      v.type === 'PHONE_WORKS' || v.type === 'PHONE_INCORRECT'
    );
    const emailValidations = validations.filter(v => 
      v.type === 'EMAIL_WORKS' || v.type === 'EMAIL_INCORRECT'
    );
    const whatsappValidations = validations.filter(v => 
      v.type === 'WHATSAPP_WORKS' || v.type === 'WHATSAPP_INCORRECT'
    );
    const generalValidations = validations.filter(v => 
      v.type === 'GENERAL_CORRECT' || v.type === 'GENERAL_INCORRECT'
    );

    const calculateStats = (vals: any[]) => {
      const total = vals.length;
      const positive = vals.filter(v => v.isCorrect).length;
      const negative = total - positive;
      const percentage = total > 0 ? Math.round((positive / total) * 100) : 0;
      return { total, positive, negative, percentage };
    };

    return {
      phone: calculateStats(phoneValidations),
      email: calculateStats(emailValidations),
      whatsapp: calculateStats(whatsappValidations),
      general: calculateStats(generalValidations),
    };
  }

  private calculateTrustLevel(percentage: number, total: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED' {
    if (total === 0) return 'LOW';
    if (total >= 20 && percentage >= 90) return 'VERIFIED';
    if (total >= 10 && percentage >= 80) return 'HIGH';
    if (total >= 5 && percentage >= 60) return 'MEDIUM';
    return 'LOW';
  }

  private calculateUserLevel(totalValidations: number): 'NOVATO' | 'EXPERTO' | 'SUPER_VALIDADOR' {
    if (totalValidations >= 100) return 'SUPER_VALIDADOR';
    if (totalValidations >= 50) return 'EXPERTO';
    return 'NOVATO';
  }

  private calculateUserBadges(totalValidations: number, helpfulValidations: number): string[] {
    const badges: string[] = [];
    
    if (totalValidations >= 10) badges.push('VERIFICADOR_NOVATO');
    if (totalValidations >= 50) badges.push('EXPERTO_LOCAL');
    if (totalValidations >= 100) badges.push('SUPER_VALIDADOR');
    if (helpfulValidations >= 25) badges.push('OPINION_CONFIABLE');
    if (totalValidations >= 30 && helpfulValidations / totalValidations >= 0.9) {
      badges.push('PRECISION_ALTA');
    }
    
    return badges;
  }
}