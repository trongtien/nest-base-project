import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { Repository } from 'typeorm';
import { BaseRepository } from '../shared/base.repository';
import { VerifyOTPEntity } from './entities/verify-otp.entity';

@Injectable()
export class VerifyOtpRepository extends BaseRepository<VerifyOTPEntity> {
    constructor(@InjectRepository(VerifyOTPEntity) private readonly verifyOtpRepository: Repository<VerifyOTPEntity>) {
        super(verifyOtpRepository);
    }

    async findManyEmail(email: string): Promise<VerifyOTPEntity[]> {
        try {
            const builder = this.verifyOtpRepository
                .createQueryBuilder('verifyOtp')
                .andWhere('verifyOtp.email like :email', { email: `%${email}%` });

            const verifies = await builder.getMany();

            return verifies;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
