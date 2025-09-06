-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'VERIFIED', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL', 'SMS', 'PHONE_CALL');

-- CreateTable
CREATE TABLE "business_claims" (
    "id" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "verificationType" "VerificationType" NOT NULL,
    "contactValue" TEXT NOT NULL,
    "verificationCode" TEXT,
    "codeExpiresAt" TIMESTAMP(3),
    "claimReason" TEXT,
    "adminNotes" TEXT,
    "businessId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "business_claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "business_claims_businessId_idx" ON "business_claims"("businessId");

-- CreateIndex
CREATE INDEX "business_claims_userId_idx" ON "business_claims"("userId");

-- CreateIndex
CREATE INDEX "business_claims_status_idx" ON "business_claims"("status");

-- CreateIndex
CREATE INDEX "business_claims_createdAt_idx" ON "business_claims"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "business_claims_businessId_userId_key" ON "business_claims"("businessId", "userId");

-- AddForeignKey
ALTER TABLE "business_claims" ADD CONSTRAINT "business_claims_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_claims" ADD CONSTRAINT "business_claims_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
