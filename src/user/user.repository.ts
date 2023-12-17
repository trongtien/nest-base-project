import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { In, Not, Repository } from 'typeorm';
import { BaseRepository } from '../shared/base.repository';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class UserRepository extends BaseRepository<CustomerEntity> {
    constructor(@InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>) {
        super(customerRepository);
    }

    async findAuthentication(text: string): Promise<CustomerEntity | null> {
        try {
            const entities = await this.customerRepository
                .createQueryBuilder('customers')
                .innerJoinAndSelect('customers.customerInfo', 'customerInfo')
                .innerJoinAndSelect('customerInfo.province', 'province')
                .leftJoinAndSelect('customerInfo.district', 'district')
                .leftJoinAndSelect('customerInfo.ward', 'ward')
                .orWhere('customers.phone = :phone', { phone: text })
                .orWhere('customers.email = :email', { email: text })
                .getOne();

            return entities;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findByRefreshToken(refreshToken: string): Promise<CustomerEntity | null> {
        try {
            const entities = this.customerRepository.findOneBy({ refreshToken: refreshToken });
            return entities;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findByPhone(phone: string, idsIgnore?: string[]): Promise<CustomerEntity | null> {
        try {
            const entities = await this.customerRepository.findOne({
                where: {
                    id: Not(In(idsIgnore ?? [])),
                    phone: phone,
                },
            });
            return entities;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findByEmail(email: string, idsIgnore?: string[]): Promise<CustomerEntity | null> {
        try {
            const entities = await this.customerRepository.findOne({
                where: {
                    id: Not(In(idsIgnore ?? [])),
                    email: email,
                },
            });
            return entities;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
