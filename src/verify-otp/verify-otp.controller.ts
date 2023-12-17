import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { VerifyOtpService } from './verify-otp.service';
import { ApiTags } from '@nestjs/swagger';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ExceptionCustom } from '../shared/exception/custom.exception';

@Controller('/auth/verify-otp')
@ApiTags('Authentication Customer')
export class VerifyOtpController {
    constructor(private readonly verifyOtpService: VerifyOtpService) {}

    @Post()
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        try {
            return await this.verifyOtpService.VerifyOtpEmail(verifyEmailDto);
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
