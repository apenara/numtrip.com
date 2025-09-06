import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Sends a verification email with a 6-digit code
   * In production, this would integrate with SendGrid, AWS SES, or similar
   */
  async sendVerificationEmail(
    email: string,
    verificationCode: string,
    businessName: string
  ): Promise<boolean> {
    try {
      // For development, we'll just log the email content
      // In production, replace this with actual email sending logic
      
      const emailContent = {
        to: email,
        subject: `Verify your business claim for ${businessName} - NumTrip`,
        html: this.generateVerificationEmailTemplate(
          verificationCode,
          businessName
        ),
        text: `Your verification code for claiming ${businessName} on NumTrip is: ${verificationCode}. This code expires in 1 hour.`
      };

      // TODO: Replace with actual email service integration
      this.logger.log(`[DEVELOPMENT] Sending verification email:`, emailContent);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      this.logger.error('Failed to send verification email', error);
      return false;
    }
  }

  /**
   * Sends a notification email when claim is approved
   */
  async sendClaimApprovedEmail(
    email: string,
    businessName: string
  ): Promise<boolean> {
    try {
      const emailContent = {
        to: email,
        subject: `Your business claim has been approved - ${businessName}`,
        html: this.generateApprovalEmailTemplate(businessName),
        text: `Congratulations! Your claim for ${businessName} has been approved. You now have full access to manage your business profile on NumTrip.`
      };

      // TODO: Replace with actual email service integration
      this.logger.log(`[DEVELOPMENT] Sending approval email:`, emailContent);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      this.logger.error('Failed to send approval email', error);
      return false;
    }
  }

  /**
   * Generates HTML template for verification email
   */
  private generateVerificationEmailTemplate(
    verificationCode: string,
    businessName: string
  ): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Business Claim</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
        <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">
          NumTrip - Business Verification
        </h1>
        
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          Hello,
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          You've requested to claim <strong>${businessName}</strong> on NumTrip.
          To verify your ownership, please use the following verification code:
        </p>
        
        <div style="background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <h2 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">
            ${verificationCode}
          </h2>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          This code will expire in <strong>1 hour</strong>. If you didn't request this verification, please ignore this email.
        </p>
        
        <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; text-align: center;">
          NumTrip - Verified Tourism Contacts Platform
        </p>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generates HTML template for approval email
   */
  private generateApprovalEmailTemplate(businessName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Business Claim Approved</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f0fdf4; padding: 30px; border-radius: 10px;">
        <h1 style="color: #16a34a; text-align: center; margin-bottom: 30px;">
          🎉 Congratulations!
        </h1>
        
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          Great news! Your claim for <strong>${businessName}</strong> has been approved.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          You now have full access to:
        </p>
        
        <ul style="font-size: 16px; line-height: 1.8; color: #374151; padding-left: 20px;">
          <li>Manage your business information</li>
          <li>Create and manage promotional codes</li>
          <li>Access detailed analytics and statistics</li>
          <li>Enjoy an ad-free business profile</li>
          <li>Display your verified business badge</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Access Your Dashboard
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; color: #374151;">
          Thank you for joining NumTrip's verified business community!
        </p>
        
        <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; text-align: center;">
          NumTrip - Verified Tourism Contacts Platform
        </p>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generates a random 6-digit verification code
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}