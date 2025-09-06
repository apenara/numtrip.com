import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from './email.service';
import { ClaimStatus, VerificationType } from '@prisma/client';
import { 
  StartClaimDto, 
  VerifyClaimDto, 
  ClaimResponseDto, 
  BusinessClaimSummaryDto,
  AdminClaimActionDto 
} from './dto/claim.dto';

@Injectable()
export class ClaimService {
  private readonly logger = new Logger(ClaimService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Initiates a business claim process
   */
  async startClaim(
    businessId: string,
    userId: string,
    startClaimDto: StartClaimDto,
    ipAddress: string,
    userAgent?: string
  ): Promise<ClaimResponseDto> {
    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    // Check if business is already claimed by another user
    if (business.ownerId && business.ownerId !== userId) {
      throw new ConflictException('This business is already claimed by another user');
    }

    // Check if user already has a pending/verified claim for this business
    const existingClaim = await this.prisma.businessClaim.findUnique({
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
    });

    if (existingClaim && ['PENDING', 'VERIFIED'].includes(existingClaim.status)) {
      throw new ConflictException('You already have a pending claim for this business');
    }

    // Validate contact value matches business information
    const isValidContact = this.validateContactValue(
      business,
      startClaimDto.contactValue,
      startClaimDto.verificationType
    );

    if (!isValidContact) {
      throw new BadRequestException(
        'Contact value does not match any business contact information'
      );
    }

    // Generate verification code
    const verificationCode = this.emailService.generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create or update the claim
    const claim = await this.prisma.businessClaim.upsert({
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
      update: {
        status: ClaimStatus.PENDING,
        verificationType: startClaimDto.verificationType,
        contactValue: startClaimDto.contactValue,
        verificationCode,
        codeExpiresAt,
        claimReason: startClaimDto.claimReason,
        ipAddress,
        userAgent,
        updatedAt: new Date(),
      },
      create: {
        businessId,
        userId,
        status: ClaimStatus.PENDING,
        verificationType: startClaimDto.verificationType,
        contactValue: startClaimDto.contactValue,
        verificationCode,
        codeExpiresAt,
        claimReason: startClaimDto.claimReason,
        ipAddress,
        userAgent,
      },
    });

    // Send verification email/SMS
    let verificationSent = false;
    if (startClaimDto.verificationType === VerificationType.EMAIL) {
      verificationSent = await this.emailService.sendVerificationEmail(
        startClaimDto.contactValue,
        verificationCode,
        business.name
      );
    } else if (startClaimDto.verificationType === VerificationType.SMS) {
      // TODO: Implement SMS service
      this.logger.log(`[TODO] Send SMS to ${startClaimDto.contactValue}: Code ${verificationCode}`);
      verificationSent = true; // Simulate success for now
    }

    if (!verificationSent) {
      throw new BadRequestException('Failed to send verification code');
    }

    return this.mapClaimToDto(claim);
  }

  /**
   * Verifies the claim with the provided code
   */
  async verifyClaim(verifyClaimDto: VerifyClaimDto): Promise<ClaimResponseDto> {
    const claim = await this.prisma.businessClaim.findUnique({
      where: { id: verifyClaimDto.claimId },
      include: { business: true, user: true },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    // Check if claim is in correct state
    if (claim.status !== ClaimStatus.PENDING) {
      throw new BadRequestException('Claim is not in a verifiable state');
    }

    // Check if code has expired
    if (!claim.codeExpiresAt || claim.codeExpiresAt < new Date()) {
      await this.prisma.businessClaim.update({
        where: { id: claim.id },
        data: { status: ClaimStatus.EXPIRED },
      });
      throw new BadRequestException('Verification code has expired');
    }

    // Check if code matches
    if (claim.verificationCode !== verifyClaimDto.verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    // Update claim to verified status and approve automatically for now
    // In a production system, you might want manual admin approval for some cases
    const updatedClaim = await this.prisma.businessClaim.update({
      where: { id: claim.id },
      data: {
        status: ClaimStatus.APPROVED,
        verifiedAt: new Date(),
        approvedAt: new Date(),
        verificationCode: null, // Clear the code after use
        codeExpiresAt: null,
      },
    });

    // Update business ownership
    await this.prisma.business.update({
      where: { id: claim.businessId },
      data: {
        ownerId: claim.userId,
        verified: true,
        claimedAt: new Date(),
      },
    });

    // Send approval email
    if (claim.verificationType === VerificationType.EMAIL) {
      await this.emailService.sendClaimApprovedEmail(
        claim.contactValue,
        claim.business.name
      );
    }

    this.logger.log(`Business claim approved: ${claim.business.name} claimed by user ${claim.userId}`);

    return this.mapClaimToDto(updatedClaim);
  }

  /**
   * Get all claims for a user
   */
  async getUserClaims(userId: string): Promise<BusinessClaimSummaryDto[]> {
    const claims = await this.prisma.businessClaim.findMany({
      where: { userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            category: true,
            city: true,
            verified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return claims.map(claim => ({
      id: claim.id,
      status: claim.status,
      verificationType: claim.verificationType,
      contactValue: claim.contactValue,
      createdAt: claim.createdAt,
      verifiedAt: claim.verifiedAt,
      approvedAt: claim.approvedAt,
      business: claim.business,
    }));
  }

  /**
   * Get user's owned businesses (approved claims)
   */
  async getUserBusinesses(userId: string) {
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: userId },
      include: {
        promoCodes: {
          where: { active: true },
          select: { id: true, code: true, description: true, discount: true, validUntil: true },
        },
        validations: {
          select: { id: true, isCorrect: true, createdAt: true },
        },
        _count: {
          select: { validations: true },
        },
      },
      orderBy: { claimedAt: 'desc' },
    });

    return businesses.map(business => ({
      ...business,
      validationStats: {
        total: business._count.validations,
        positive: business.validations.filter(v => v.isCorrect).length,
        negative: business.validations.filter(v => !v.isCorrect).length,
      },
    }));
  }

  /**
   * Get claim by ID
   */
  async getClaim(claimId: string, userId?: string): Promise<ClaimResponseDto> {
    const where: any = { id: claimId };
    if (userId) {
      where.userId = userId; // Ensure user can only see their own claims
    }

    const claim = await this.prisma.businessClaim.findUnique({
      where,
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return this.mapClaimToDto(claim);
  }

  /**
   * Admin function to approve/reject claims
   */
  async adminActionClaim(
    claimId: string,
    adminActionDto: AdminClaimActionDto
  ): Promise<ClaimResponseDto> {
    const claim = await this.prisma.businessClaim.findUnique({
      where: { id: claimId },
      include: { business: true },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const newStatus = adminActionDto.action === 'APPROVE' 
      ? ClaimStatus.APPROVED 
      : ClaimStatus.REJECTED;

    const updatedClaim = await this.prisma.businessClaim.update({
      where: { id: claimId },
      data: {
        status: newStatus,
        adminNotes: adminActionDto.adminNotes,
        approvedAt: adminActionDto.action === 'APPROVE' ? new Date() : null,
      },
    });

    // If approved, update business ownership
    if (adminActionDto.action === 'APPROVE') {
      await this.prisma.business.update({
        where: { id: claim.businessId },
        data: {
          ownerId: claim.userId,
          verified: true,
          claimedAt: new Date(),
        },
      });

      // Send approval email
      if (claim.verificationType === VerificationType.EMAIL) {
        await this.emailService.sendClaimApprovedEmail(
          claim.contactValue,
          claim.business.name
        );
      }
    }

    return this.mapClaimToDto(updatedClaim);
  }

  /**
   * Validates that the contact value matches business information
   */
  private validateContactValue(
    business: any,
    contactValue: string,
    verificationType: VerificationType
  ): boolean {
    switch (verificationType) {
      case VerificationType.EMAIL:
        return business.email === contactValue;
      case VerificationType.SMS:
      case VerificationType.PHONE_CALL:
        return business.phone === contactValue || business.whatsapp === contactValue;
      default:
        return false;
    }
  }

  /**
   * Maps BusinessClaim entity to DTO
   */
  private mapClaimToDto(claim: any): ClaimResponseDto {
    return {
      id: claim.id,
      status: claim.status,
      verificationType: claim.verificationType,
      contactValue: claim.contactValue,
      claimReason: claim.claimReason,
      businessId: claim.businessId,
      userId: claim.userId,
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt,
      verifiedAt: claim.verifiedAt,
      approvedAt: claim.approvedAt,
    };
  }
}