import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
    static _soldPasswordService = 10;

    public async generatorPassword(password: string, soldPassword?: number): Promise<string> {
        const saltOrRounds = soldPassword ? soldPassword : EncryptService._soldPasswordService;

        const hashingPassword = bcrypt.hash(password.trim(), saltOrRounds);
        return hashingPassword;
    }

    /**
     *  @title Compare password
     *  @param body {password: string, hasPassword: string} compare
     *  @field password - password request body
     *  @field hasPassword - password query customer by username
     *  @returns {boolean}
     */
    public async comparePassword(password: string, hasPassword: string): Promise<boolean> {
        if (!password || !hasPassword) {
            return false;
        }

        const compareBcrypt = await bcrypt.compare(password.trim(), hasPassword.trim());

        return compareBcrypt;
    }

    public async generatorVerifyOtp(otp: string, soldPassword?: number): Promise<string> {
        const saltOrRounds = soldPassword ? soldPassword : EncryptService._soldPasswordService;

        const hashingOTP = bcrypt.hash(otp.trim(), saltOrRounds);
        return hashingOTP;
    }

    /**
     *  @title Compare password
     *  @param body {password: string, hasPassword: string} compare
     *  @field password - password request body
     *  @field hasPassword - password query customer by username
     *  @returns {boolean}
     */
    public async compareVerifyOtp(otp: string, hasOtp: string): Promise<boolean> {
        if (!otp || !hasOtp) {
            return false;
        }

        const compareBcrypt = await bcrypt.compare(otp.trim(), hasOtp.trim());

        return compareBcrypt;
    }
}
