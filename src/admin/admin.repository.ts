import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { In, Not, Repository } from 'typeorm';
import { BaseRepository } from '../shared/base.repository';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AdminRepository extends BaseRepository<AdminEntity> {
    constructor(@InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>) {
        super(adminRepository);
    }

    async findAuthentication(text: string): Promise<AdminEntity | null> {
        try {
            const entities = await this.adminRepository
                .createQueryBuilder('admins')
                .orWhere('admins.username = :username', { username: text })
                .getOne();

            return entities;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findByUsername(username: string, idsIgnore?: string[]): Promise<AdminEntity | null> {
        try {
            const entities = await this.adminRepository.findOne({
                where: {
                    id: Not(In(idsIgnore ?? [])),
                    username: username,
                },
            });
            return entities;
        } catch (error: any) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
