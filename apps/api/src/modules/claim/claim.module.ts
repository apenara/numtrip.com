import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';
import { EmailService } from './email.service';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ClaimController],
  providers: [ClaimService, EmailService],
  exports: [ClaimService, EmailService],
})
export class ClaimModule {}