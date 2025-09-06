import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BusinessOwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User authentication required');
    }

    // Extract business ID from params (supports both :businessId and :id parameters)
    const businessId = request.params.businessId || request.params.id;
    
    if (!businessId) {
      throw new ForbiddenException('Business ID required in route parameters');
    }

    try {
      // Check if the business exists and if user is the owner
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
        select: {
          id: true,
          ownerId: true,
          name: true,
          active: true,
        },
      });

      if (!business) {
        throw new NotFoundException('Business not found');
      }

      if (!business.active) {
        throw new ForbiddenException('Business is not active');
      }

      if (business.ownerId !== user.id) {
        throw new ForbiddenException(
          'Access denied: You do not own this business'
        );
      }

      // Attach business info to request for use in controllers
      request.business = business;

      return true;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Failed to verify business ownership');
    }
  }
}