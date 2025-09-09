import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessSearchDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BusinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(searchDto: BusinessSearchDto) {
    const {
      query,
      city,
      category,
      verified,
      page = 1,
      limit = 20,
    } = searchDto;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100); // Max 100 items per page

    const where: Prisma.BusinessWhereInput = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
      ...(verified !== undefined && { verified }),
    };

    // If city is provided, filter by city name
    if (city) {
      where.city = {
        name: { equals: city, mode: 'insensitive' }
      };
    }

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          city: true,
          contacts: true,
          validations: {
            include: {
              contact: true,
            },
          },
        },
        skip,
        take,
        orderBy: [
          { verified: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.business.count({ where }),
    ]);

    return {
      data: businesses,
      pagination: {
        total,
        page,
        limit: take,
        pages: Math.ceil(total / take),
      },
    };
  }

  async findById(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
      include: {
        city: true,
        contacts: true,
        validations: {
          include: {
            contact: true,
          },
        },
        claims: true,
      },
    });
  }

  async create(data: CreateBusinessDto) {
    // First, get or create city
    let cityRecord = await this.prisma.city.findFirst({
      where: { name: data.city }
    });

    if (!cityRecord) {
      cityRecord = await this.prisma.city.create({
        data: {
          name: data.city,
          country: 'Colombia', // Default for now
        }
      });
    }

    // Create business without phone/email/whatsapp fields
    const business = await this.prisma.business.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        cityId: cityRecord.id,
        latitude: data.latitude,
        longitude: data.longitude,
        website: data.website,
        googlePlaceId: data.googlePlaceId,
        verified: data.verified || false,
      },
      include: {
        city: true,
        contacts: true,
      },
    });

    // Create contacts if provided
    const contactPromises = [];
    if (data.phone) {
      contactPromises.push(
        this.prisma.contact.create({
          data: {
            businessId: business.id,
            type: 'PHONE',
            value: data.phone,
            primaryContact: true,
          }
        })
      );
    }
    if (data.email) {
      contactPromises.push(
        this.prisma.contact.create({
          data: {
            businessId: business.id,
            type: 'EMAIL',
            value: data.email,
            primaryContact: !data.phone,
          }
        })
      );
    }
    if (data.whatsapp) {
      contactPromises.push(
        this.prisma.contact.create({
          data: {
            businessId: business.id,
            type: 'WHATSAPP',
            value: data.whatsapp,
            primaryContact: !data.phone && !data.email,
          }
        })
      );
    }

    if (contactPromises.length > 0) {
      await Promise.all(contactPromises);
    }

    // Return business with contacts
    return this.findById(business.id);
  }

  async update(id: string, data: UpdateBusinessDto) {
    // Update business (excluding contact fields)
    const business = await this.prisma.business.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        website: data.website,
        verified: data.verified,
        updatedAt: new Date(),
      },
      include: {
        city: true,
        contacts: true,
      },
    });

    // Update contacts if provided
    if (data.phone !== undefined) {
      await this.updateOrCreateContact(id, 'PHONE', data.phone);
    }
    if (data.email !== undefined) {
      await this.updateOrCreateContact(id, 'EMAIL', data.email);
    }
    if (data.whatsapp !== undefined) {
      await this.updateOrCreateContact(id, 'WHATSAPP', data.whatsapp);
    }

    return this.findById(id);
  }

  async claim(businessId: string, userId: string) {
    return this.prisma.business.update({
      where: { id: businessId },
      data: {
        claimed: true,
        ownerId: userId,
      },
      include: {
        city: true,
        contacts: true,
      },
    });
  }

  async findManyByOwner(ownerId: string) {
    return this.prisma.business.findMany({
      where: {
        ownerId,
      },
      include: {
        city: true,
        contacts: true,
        validations: {
          include: {
            contact: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    // Soft delete by removing from search results
    return this.prisma.business.update({
      where: { id },
      data: { 
        verified: false,
        claimed: false,
      },
    });
  }

  private async updateOrCreateContact(businessId: string, type: string, value: string | null) {
    if (!value) {
      // Delete contact if value is null
      await this.prisma.contact.deleteMany({
        where: {
          businessId,
          type: type as any,
        }
      });
      return;
    }

    const existing = await this.prisma.contact.findFirst({
      where: {
        businessId,
        type: type as any,
      }
    });

    if (existing) {
      await this.prisma.contact.update({
        where: { id: existing.id },
        data: { value }
      });
    } else {
      await this.prisma.contact.create({
        data: {
          businessId,
          type: type as any,
          value,
          primaryContact: false,
        }
      });
    }
  }
}