import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  BusinessOverviewDto,
  BusinessMetricsDto,
  BusinessStatsDto,
  RecentActivityDto,
  UpdateBusinessDto,
  ValidationResponseDto
} from './dto/business-dashboard.dto';

@Injectable()
export class BusinessDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessOverview(businessId: string, userId: string): Promise<BusinessOverviewDto> {
    // Verify business ownership
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userId,
      },
      include: {
        validations: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        promoCodes: {
          where: { active: true },
        }
      }
    });

    if (!business) {
      throw new NotFoundException('Business not found or access denied');
    }

    // Calculate metrics
    const metrics = await this.calculateBusinessMetrics(businessId);
    const stats = await this.calculateBusinessStats(businessId);
    const recentActivity = await this.getRecentActivity(businessId);

    // Calculate action items
    const actionItems = [];
    const unreadValidations = await this.getUnreadValidationsCount(businessId);
    const expiringSoonPromoCodes = await this.getExpiringSoonPromoCodesCount(businessId);

    if (!business.description) actionItems.push('Add business description');
    if (!business.phone && !business.email && !business.whatsapp) {
      actionItems.push('Add contact information');
    }
    if (unreadValidations > 0) actionItems.push(`Respond to ${unreadValidations} validations`);
    if (expiringSoonPromoCodes > 0) actionItems.push(`${expiringSoonPromoCodes} promo codes expiring soon`);

    return {
      metrics,
      stats,
      recentActivity,
      businessName: business.name,
      businessCategory: business.category,
      verificationStatus: business.verified ? 'verified' : 'pending',
      claimedAt: business.claimedAt || business.createdAt,
      actionItems,
      unreadValidations,
      expiringSoonPromoCodes,
    };
  }

  private async calculateBusinessMetrics(businessId: string): Promise<BusinessMetricsDto> {
    // For now, we'll simulate metrics since we don't have analytics tracking yet
    // In production, these would come from analytics events
    
    const validations = await this.prisma.validation.findMany({
      where: { businessId },
    });

    const promoCodes = await this.prisma.promoCode.findMany({
      where: { 
        businessId,
        active: true,
      },
    });

    const positiveValidations = validations.filter(v => v.isCorrect).length;
    const negativeValidations = validations.filter(v => !v.isCorrect).length;
    const totalValidations = validations.length;

    // Calculate trust score (0-100)
    const trustScore = totalValidations > 0 
      ? Math.round((positiveValidations / totalValidations) * 100) 
      : 50; // Default neutral score

    return {
      profileViews: Math.floor(Math.random() * 1000) + 100, // Mock data
      contactClicks: Math.floor(Math.random() * 200) + 20,
      validationCount: totalValidations,
      trustScore,
      promoCodeUsage: Math.floor(Math.random() * 50),
      
      viewsThisMonth: Math.floor(Math.random() * 500) + 50,
      viewsLastMonth: Math.floor(Math.random() * 400) + 40,
      clicksThisMonth: Math.floor(Math.random() * 100) + 10,
      clicksLastMonth: Math.floor(Math.random() * 80) + 8,
      
      positiveValidations,
      negativeValidations,
      validationResponseRate: 0, // Will implement later
    };
  }

  private async calculateBusinessStats(businessId: string): Promise<BusinessStatsDto> {
    const metrics = await this.calculateBusinessMetrics(businessId);
    
    // Calculate growth percentages
    const viewsGrowth = metrics.viewsLastMonth > 0 
      ? Math.round(((metrics.viewsThisMonth - metrics.viewsLastMonth) / metrics.viewsLastMonth) * 100)
      : 100;

    const clicksGrowth = metrics.clicksLastMonth > 0
      ? Math.round(((metrics.clicksThisMonth - metrics.clicksLastMonth) / metrics.clicksLastMonth) * 100)
      : 100;

    return {
      totalViews: metrics.profileViews,
      totalClicks: metrics.contactClicks,
      totalValidations: metrics.validationCount,
      averageTrustScore: metrics.trustScore,
      
      recentViews: metrics.viewsThisMonth,
      recentClicks: metrics.clicksThisMonth,
      recentValidations: metrics.validationCount, // Last 30 days
      
      viewsGrowth,
      clicksGrowth,
      validationsGrowth: 0, // Mock for now
      
      mostClickedContact: 'phone', // Mock data
      peakViewHour: Math.floor(Math.random() * 12) + 9, // 9 AM to 9 PM
      peakViewDay: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][Math.floor(Math.random() * 5)],
    };
  }

  private async getRecentActivity(businessId: string): Promise<RecentActivityDto[]> {
    // Get recent validations as activities
    const recentValidations = await this.prisma.validation.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const activities: RecentActivityDto[] = recentValidations.map(validation => ({
      id: validation.id,
      type: 'validation' as const,
      description: validation.isCorrect 
        ? `Positive validation for ${validation.type.toLowerCase()}`
        : `Negative validation for ${validation.type.toLowerCase()}`,
      timestamp: validation.createdAt,
      metadata: {
        type: validation.type,
        isCorrect: validation.isCorrect,
        comment: validation.comment,
      }
    }));

    // Add some mock activities for demonstration
    activities.push({
      id: 'view-1',
      type: 'view',
      description: 'Profile viewed by visitor',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    });

    activities.push({
      id: 'click-1', 
      type: 'click',
      description: 'Phone number clicked',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }

  async updateBusiness(businessId: string, userId: string, updateData: UpdateBusinessDto) {
    // Verify ownership
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found or access denied');
    }

    // Update business information
    const updatedBusiness = await this.prisma.business.update({
      where: { id: businessId },
      data: {
        name: updateData.name,
        description: updateData.description,
        address: updateData.address,
        phone: updateData.phone,
        email: updateData.email,
        whatsapp: updateData.whatsapp,
        website: updateData.website,
        updatedAt: new Date(),
      },
    });

    return updatedBusiness;
  }

  async getBusinessValidations(businessId: string, userId: string) {
    // Verify ownership
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found or access denied');
    }

    const validations = await this.prisma.validation.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit for performance
    });

    return validations;
  }

  async respondToValidation(businessId: string, userId: string, responseData: ValidationResponseDto) {
    // Verify business ownership
    const business = await this.prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: userId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found or access denied');
    }

    // Verify validation belongs to this business
    const validation = await this.prisma.validation.findFirst({
      where: {
        id: responseData.validationId,
        businessId,
      },
    });

    if (!validation) {
      throw new NotFoundException('Validation not found');
    }

    // For now, we'll store the response in the comment field
    // In a full implementation, we'd have a separate ValidationResponse table
    const updatedValidation = await this.prisma.validation.update({
      where: { id: responseData.validationId },
      data: {
        comment: `${validation.comment || ''}\n\nBusiness Response: ${responseData.response}`,
      },
    });

    return updatedValidation;
  }

  private async getUnreadValidationsCount(businessId: string): Promise<number> {
    // For now, count all validations without responses
    // In production, we'd track which validations have been read/responded to
    const count = await this.prisma.validation.count({
      where: { 
        businessId,
        comment: null, // Validations without comments (unresponded)
      },
    });

    return count;
  }

  private async getExpiringSoonPromoCodesCount(businessId: string): Promise<number> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const count = await this.prisma.promoCode.count({
      where: {
        businessId,
        active: true,
        validUntil: {
          lte: thirtyDaysFromNow,
        },
      },
    });

    return count;
  }
}