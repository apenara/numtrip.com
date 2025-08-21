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
      active: true,
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(city && { city: { equals: city, mode: 'insensitive' } }),
      ...(category && { category }),
      ...(verified !== undefined && { verified }),
    };

    const [businesses, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, verified: true },
          },
          promoCodes: {
            where: { active: true },
            select: {
              id: true,
              code: true,
              description: true,
              discount: true,
              validUntil: true,
            },
          },
          _count: {
            select: {
              validations: {
                where: { isCorrect: true },
              },
            },
          },
        },
        orderBy: [
          { verified: 'desc' }, // Verified businesses first
          { createdAt: 'desc' },
        ],
        skip,
        take,
      }),
      this.prisma.business.count({ where }),
    ]);

    return {
      data: businesses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, verified: true },
        },
        promoCodes: {
          where: { active: true },
          select: {
            id: true,
            code: true,
            description: true,
            discount: true,
            validUntil: true,
          },
        },
        validations: {
          select: {
            id: true,
            type: true,
            isCorrect: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 validations
        },
        _count: {
          select: {
            validations: {
              where: { isCorrect: true },
            },
          },
        },
      },
    });
  }

  async create(data: CreateBusinessDto) {
    return this.prisma.business.create({
      data,
      include: {
        owner: {
          select: { id: true, name: true, verified: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateBusinessDto) {
    return this.prisma.business.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: { id: true, name: true, verified: true },
        },
      },
    });
  }

  async claim(id: string, userId: string) {
    return this.prisma.business.update({
      where: { id },
      data: {
        ownerId: userId,
        claimedAt: new Date(),
        verified: true, // Auto-verify when claimed
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: { id: true, name: true, verified: true },
        },
      },
    });
  }

  async findByCity(city: string) {
    return this.prisma.business.findMany({
      where: {
        city: { equals: city, mode: 'insensitive' },
        active: true,
      },
      include: {
        _count: {
          select: {
            validations: {
              where: { isCorrect: true },
            },
          },
        },
      },
      orderBy: [
        { verified: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findVerified() {
    return this.prisma.business.findMany({
      where: {
        verified: true,
        active: true,
      },
      include: {
        owner: {
          select: { id: true, name: true, verified: true },
        },
        _count: {
          select: {
            validations: {
              where: { isCorrect: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    return this.prisma.business.update({
      where: { id },
      data: { active: false },
    });
  }
}