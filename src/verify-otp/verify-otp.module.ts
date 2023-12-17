import { Module } from '@nestjs/common';
import { VerifyOtpService } from './verify-otp.service';
import { VerifyOtpController } from './verify-otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyOTPEntity } from './entities/verify-otp.entity';
import { VerifyOtpRepository } from './verify-otp.repository';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([VerifyOTPEntity]), UserModule],
    controllers: [VerifyOtpController],
    providers: [VerifyOtpService, VerifyOtpRepository],
    exports: [VerifyOtpService],
})
export class VerifyOtpModule {}
