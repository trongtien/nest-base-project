import { HttpStatus, Injectable } from '@nestjs/common';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ExceptionCustom } from '../shared/exception/custom.exception';
import { VerifyOtpRepository } from './verify-otp.repository';
import { UserService } from '../user/user.service';
import { EncryptService } from '../shared/utils/encrypt.service';
import { EIsVerify } from '../user/user.type';
import { VerifyOTPEntity } from './entities/verify-otp.entity';

@Injectable()
export class VerifyOtpService {
    constructor(
        private readonly verifyOtpRepository: VerifyOtpRepository,
        private readonly userService: UserService,
        private readonly encryptService: EncryptService,
    ) {}

    async VerifyOtpEmail(context: VerifyEmailDto): Promise<boolean> {
        try {
            const verifyOTPEntity = await this.verifyOtpRepository.findManyEmail(context.email);
            const userFromEmail = await this.userService.verifyAuthenticationUser(context.email);

            if (userFromEmail === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Email invalid');
            }

            if (verifyOTPEntity.length === 0) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Otp invalid');
            }

            // Compare verify
            const optEntity = verifyOTPEntity[verifyOTPEntity.length - 1];

            // Compare encrypt otp
            const isCompareVerify = await this.encryptService.compareVerifyOtp(context.otp, optEntity.otp);
            if (!isCompareVerify && context.email !== optEntity.email) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Otp invalid');
            }

            // Check exp time otp
            const expTimeCurrent = new Date().getTime() / 1000;
            if (expTimeCurrent - optEntity.time < 0 || expTimeCurrent - optEntity.time > 60) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Otp invalid');
            }

            // Update verify customer
            userFromEmail.isVerify = EIsVerify.ACTIVE;
            await this.userService.update(userFromEmail);

            this.clearVerifyOtp(verifyOTPEntity);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    private clearVerifyOtp(verifyOTPEntity: VerifyOTPEntity[]) {
        for (const opt of verifyOTPEntity) {
            this.verifyOtpRepository.delete(opt.id);
        }
    }
}
