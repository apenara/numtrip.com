import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BusinessRepository } from './business.repository';
import { 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessSearchDto,
  CreatePromoCodeDto,
  UpdatePromoCodeDto,
  PromoCodeResponseDto
} from './dto';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly prisma: PrismaService
  ) {}

  async searchBusinesses(searchDto: BusinessSearchDto) {
    return this.businessRepository.search(searchDto);
  }

  async getBusinessById(id: string) {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return business;
  }

  async createBusiness(createBusinessDto: CreateBusinessDto) {
    return this.businessRepository.create(createBusinessDto);
  }

  async updateBusiness(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.getBusinessById(id);
    return this.businessRepository.update(id, updateBusinessDto);
  }

  async claimBusiness(id: string, userId?: string) {
    const business = await this.getBusinessById(id);
    
    if (business.ownerId) {
      throw new ConflictException('Business is already claimed');
    }

    return this.businessRepository.claim(id, userId);
  }

  async getBusinessesByCity(city: string) {
    return this.businessRepository.findByCity(city);
  }

  async getVerifiedBusinesses() {
    return this.businessRepository.findVerified();
  }

  // Business Owner Methods

  /**
   * Updates business information (only by owner)
   */
  async updateBusinessByOwner(id: string, updateBusinessDto: UpdateBusinessDto, userId: string) {
    const business = await this.getBusinessById(id);
    
    if (business.ownerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this business');
    }

    return this.businessRepository.update(id, updateBusinessDto);
  }

  /**
   * Creates a promo code for a business (only by owner)
   */
  async createPromoCode(
    businessId: string, 
    createPromoCodeDto: CreatePromoCodeDto, 
    userId: string
  ): Promise<PromoCodeResponseDto> {
    await this.verifyBusinessOwnership(businessId, userId);

    // Check if promo code already exists for this business
    const existingPromo = await this.prisma.promoCode.findFirst({
      where: {
        businessId,
        code: createPromoCodeDto.code,
      },
    });

    if (existingPromo) {
      throw new ConflictException('A promo code with this code already exists for this business');
    }

    const promoCode = await this.prisma.promoCode.create({
      data: {
        businessId,
        code: createPromoCodeDto.code,
        description: createPromoCodeDto.description,
        discount: createPromoCodeDto.discount,
        validUntil: createPromoCodeDto.validUntil ? new Date(createPromoCodeDto.validUntil) : null,
        maxUsage: createPromoCodeDto.maxUsage,
      },
    });

    return this.mapPromoCodeToDto(promoCode);
  }

  /**
   * Gets all promo codes for a business (only by owner)
   */
  async getBusinessPromoCodes(businessId: string, userId: string): Promise<PromoCodeResponseDto[]> {
    await this.verifyBusinessOwnership(businessId, userId);

    const promoCodes = await this.prisma.promoCode.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    return promoCodes.map(promo => this.mapPromoCodeToDto(promo));
  }

  /**
   * Updates a promo code (only by owner)
   */
  async updatePromoCode(
    businessId: string,
    promoId: string,
    updatePromoCodeDto: UpdatePromoCodeDto,
    userId: string
  ): Promise<PromoCodeResponseDto> {
    await this.verifyBusinessOwnership(businessId, userId);

    const promoCode = await this.prisma.promoCode.findFirst({
      where: {
        id: promoId,
        businessId,
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    const updatedPromo = await this.prisma.promoCode.update({
      where: { id: promoId },
      data: {
        description: updatePromoCodeDto.description,
        discount: updatePromoCodeDto.discount,
        validUntil: updatePromoCodeDto.validUntil ? new Date(updatePromoCodeDto.validUntil) : undefined,
        active: updatePromoCodeDto.active,
        maxUsage: updatePromoCodeDto.maxUsage,
      },
    });

    return this.mapPromoCodeToDto(updatedPromo);
  }

  /**
   * Deletes a promo code (only by owner)
   */
  async deletePromoCode(
    businessId: string,
    promoId: string,
    userId: string
  ): Promise<{ message: string }> {
    await this.verifyBusinessOwnership(businessId, userId);

    const promoCode = await this.prisma.promoCode.findFirst({
      where: {
        id: promoId,
        businessId,
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    await this.prisma.promoCode.delete({
      where: { id: promoId },
    });

    return { message: 'Promo code deleted successfully' };
  }

  /**
   * Gets business analytics (only by owner)
   */
  async getBusinessAnalytics(businessId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        validations: {
          select: {
            id: true,
            isCorrect: true,
            type: true,
            createdAt: true,
          },
        },
        promoCodes: {
          select: {
            id: true,
            code: true,
            usageCount: true,
            active: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const totalValidations = business.validations.length;
    const positiveValidations = business.validations.filter(v => v.isCorrect).length;
    const negativeValidations = totalValidations - positiveValidations;
    const validationPercentage = totalValidations > 0 ? 
      Math.round((positiveValidations / totalValidations) * 100) : 0;

    // Group validations by month for trending
    const validationsByMonth = business.validations.reduce((acc, validation) => {
      const month = validation.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {} as Record<string, number>);

    // Promo code stats
    const totalPromoCodes = business.promoCodes.length;
    const activePromoCodes = business.promoCodes.filter(p => p.active).length;
    const totalPromoUsage = business.promoCodes.reduce((sum, p) => sum + p.usageCount, 0);

    return {
      businessId,
      businessName: business.name,
      verified: business.verified,
      claimedAt: business.claimedAt,
      validationStats: {
        total: totalValidations,
        positive: positiveValidations,
        negative: negativeValidations,
        percentage: validationPercentage,
        byMonth: validationsByMonth,
      },
      promoCodeStats: {
        total: totalPromoCodes,
        active: activePromoCodes,
        totalUsage: totalPromoUsage,
      },
      // TODO: Add page views, contact clicks, etc. when tracking is implemented
      engagement: {
        profileViews: 0,
        contactClicks: 0,
      },
    };
  }

  /**
   * Verifies that a user owns a business
   */
  private async verifyBusinessOwnership(businessId: string, userId: string): Promise<void> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, ownerId: true, name: true },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('You are not authorized to manage this business');
    }
  }

  /**
   * Maps PromoCode entity to DTO
   */
  private mapPromoCodeToDto(promoCode: any): PromoCodeResponseDto {
    return {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description,
      discount: promoCode.discount,
      validUntil: promoCode.validUntil,
      active: promoCode.active,
      usageCount: promoCode.usageCount,
      maxUsage: promoCode.maxUsage,
      businessId: promoCode.businessId,
      createdAt: promoCode.createdAt,
      updatedAt: promoCode.updatedAt,
    };
  }
}