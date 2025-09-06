import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Body, 
  Param, 
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Ip
} from '@nestjs/common';
import { ClaimService } from './claim.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { 
  StartClaimDto, 
  VerifyClaimDto, 
  ClaimResponseDto, 
  BusinessClaimSummaryDto,
  AdminClaimActionDto 
} from './dto/claim.dto';

@Controller('claims')
@UseGuards(SupabaseAuthGuard)
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  /**
   * Start a business claim process
   */
  @Post(':businessId/start')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @HttpCode(HttpStatus.OK)
  async startClaim(
    @Param('businessId') businessId: string,
    @Body() startClaimDto: StartClaimDto,
    @Request() req: any,
    @Ip() ipAddress: string
  ): Promise<ClaimResponseDto> {
    const userId = req.user.id;
    const userAgent = req.headers['user-agent'];

    return this.claimService.startClaim(
      businessId,
      userId,
      startClaimDto,
      ipAddress,
      userAgent
    );
  }

  /**
   * Verify claim with verification code
   */
  @Post('verify')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @HttpCode(HttpStatus.OK)
  async verifyClaim(
    @Body() verifyClaimDto: VerifyClaimDto
  ): Promise<ClaimResponseDto> {
    return this.claimService.verifyClaim(verifyClaimDto);
  }

  /**
   * Get all claims for the authenticated user
   */
  @Get('my-claims')
  async getUserClaims(
    @Request() req: any
  ): Promise<BusinessClaimSummaryDto[]> {
    const userId = req.user.id;
    return this.claimService.getUserClaims(userId);
  }

  /**
   * Get all businesses owned by the authenticated user
   */
  @Get('my-businesses')
  async getUserBusinesses(
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.claimService.getUserBusinesses(userId);
  }

  /**
   * Get specific claim details
   */
  @Get(':claimId')
  async getClaim(
    @Param('claimId') claimId: string,
    @Request() req: any
  ): Promise<ClaimResponseDto> {
    const userId = req.user.id;
    return this.claimService.getClaim(claimId, userId);
  }

  /**
   * Admin endpoint to approve/reject claims
   * TODO: Add proper admin authentication guard
   */
  @Put(':claimId/admin-action')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async adminActionClaim(
    @Param('claimId') claimId: string,
    @Body() adminActionDto: AdminClaimActionDto
  ): Promise<ClaimResponseDto> {
    return this.claimService.adminActionClaim(claimId, adminActionDto);
  }

  /**
   * Resend verification code (restart claim process)
   */
  @Post(':businessId/resend')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
  @HttpCode(HttpStatus.OK)
  async resendVerificationCode(
    @Param('businessId') businessId: string,
    @Body() startClaimDto: StartClaimDto,
    @Request() req: any,
    @Ip() ipAddress: string
  ): Promise<ClaimResponseDto> {
    const userId = req.user.id;
    const userAgent = req.headers['user-agent'];

    // Resending is essentially the same as starting a new claim
    return this.claimService.startClaim(
      businessId,
      userId,
      startClaimDto,
      ipAddress,
      userAgent
    );
  }

  /**
   * Cancel a pending claim
   */
  @Put(':claimId/cancel')
  async cancelClaim(
    @Param('claimId') claimId: string,
    @Request() req: any
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    
    // Get the claim to ensure it belongs to the user
    await this.claimService.getClaim(claimId, userId);
    
    // For now, we'll implement this logic in the service if needed
    // This is a placeholder for the cancellation functionality
    
    return { message: 'Claim cancellation requested' };
  }
}