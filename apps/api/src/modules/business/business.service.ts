import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BusinessRepository } from './business.repository';
import { 
  CreateBusinessDto, 
  UpdateBusinessDto, 
  BusinessSearchDto
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
    await this.getBusinessById(id);
    return this.businessRepository.update(id, updateBusinessDto);
  }

  async claimBusiness(id: string, userId?: string) {
    const business = await this.getBusinessById(id);
    
    if (business.ownerId) {
      throw new ConflictException('Business is already claimed');
    }

    return this.businessRepository.claim(id, userId);
  }

  async deleteBusiness(id: string) {
    await this.getBusinessById(id);
    return this.businessRepository.delete(id);
  }

  async getMyBusinesses(userId: string) {
    return this.businessRepository.findManyByOwner(userId);
  }

  async getBusinessStats(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        contacts: true,
        validations: {
          include: {
            contact: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    const totalValidations = business.validations.length;
    const positiveValidations = business.validations.filter(v => v.isCorrect).length;
    const validationAccuracy = totalValidations > 0 
      ? (positiveValidations / totalValidations) * 100 
      : 0;

    const validationsByMonth = business.validations.reduce((acc, validation) => {
      const month = validation.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      businessId,
      businessName: business.name,
      claimedAt: business.claimed ? business.createdAt : null,
      totalContacts: business.contacts.length,
      verifiedContacts: business.contacts.filter(c => c.verified).length,
      stats: {
        validations: {
          total: totalValidations,
          positive: positiveValidations,
          negative: totalValidations - positiveValidations,
          accuracy: validationAccuracy,
          byMonth: validationsByMonth,
        },
      },
    };
  }

  async validateContact(businessId: string, contactId: string, isCorrect: boolean, comment?: string, validatorId?: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        businessId: businessId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found for this business');
    }

    const validation = await this.prisma.validation.create({
      data: {
        businessId,
        contactId,
        validatorId,
        isCorrect,
        comment,
        status: 'PENDING',
      },
    });

    // Update contact verification status if enough positive validations
    const validations = await this.prisma.validation.findMany({
      where: { contactId },
    });

    const positiveCount = validations.filter(v => v.isCorrect).length;
    const negativeCount = validations.filter(v => !v.isCorrect).length;

    if (positiveCount >= 3 && positiveCount > negativeCount * 2) {
      await this.prisma.contact.update({
        where: { id: contactId },
        data: { verified: true },
      });
    }

    return validation;
  }

  async getPopularBusinesses(limit: number = 10) {
    return this.prisma.business.findMany({
      where: { verified: true },
      include: {
        city: true,
        contacts: {
          where: { verified: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getBusinessesByCity(city: string) {
    return this.prisma.business.findMany({
      where: {
        city: {
          name: { equals: city, mode: 'insensitive' },
        },
      },
      include: {
        city: true,
        contacts: true,
      },
      orderBy: { verified: 'desc' },
    });
  }
}