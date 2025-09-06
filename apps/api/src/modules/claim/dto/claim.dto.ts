import { IsString, IsEnum, IsOptional, IsEmail, IsPhoneNumber, MinLength, MaxLength } from 'class-validator';
import { ClaimStatus, VerificationType } from '@prisma/client';

export class StartClaimDto {
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @IsString()
  @MinLength(1)
  contactValue: string; // Email or phone number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  claimReason?: string;
}

export class VerifyClaimDto {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  verificationCode: string;

  @IsString()
  claimId: string;
}

export class ClaimResponseDto {
  id: string;
  status: ClaimStatus;
  verificationType: VerificationType;
  contactValue: string;
  claimReason?: string;
  businessId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  approvedAt?: Date;
}

export class BusinessClaimSummaryDto {
  id: string;
  status: ClaimStatus;
  verificationType: VerificationType;
  contactValue: string;
  createdAt: Date;
  verifiedAt?: Date;
  approvedAt?: Date;
  business: {
    id: string;
    name: string;
    category: string;
    city: string;
    verified: boolean;
  };
}

export class AdminClaimActionDto {
  @IsEnum(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;
}