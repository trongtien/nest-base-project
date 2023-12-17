import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { Repository } from 'typeorm';
import { BaseRepository } from '../shared/base.repository';
import { WardEntity } from './entities/ward.entity';
import { TypeQueryAllProvince, TypeResultQueryAllProvince } from './ward.type';

@Injectable()
export class WardRepository extends BaseRepository<WardEntity> {
    constructor(@InjectRepository(WardEntity) private readonly wardRepository: Repository<WardEntity>) {
        super(wardRepository);
    }

    public async queryAll(option: TypeQueryAllProvince): Promise<TypeResultQueryAllProvince> {
        try {
            const { page, limit, name, code, districtCode } = option;

            const builder = await this.wardRepository.createQueryBuilder('ward');

            if (districtCode) {
                builder.andWhere('ward.districtCode = :districtCode', { districtCode: districtCode });
            }

            if (name) {
                builder.andWhere('ward.name like :name', { name: `%${name}%` });
                builder.orWhere('ward.slug like :slug', { slug: `%${name}%` });
            }

            if (code && code.length !== 0) {
                builder.andWhere('ward.code IN (:...code)', { code: [...code] });
            }

            if (limit || limit !== null) {
                builder.take(limit);
            }

            if (page) {
                const _limit = limit ? limit : 10;
                builder.skip((Number(page) - 1) * _limit);
            }

            // Start transaction
            const total = await builder.getCount();
            const items = await builder.orderBy('ward.createdAt', 'ASC').getMany();

            return {
                items: items as WardEntity[],
                limit: limit ? limit : total,
                page: page || 1,
                totalItemCount: total,
            };
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    public async findByCode(code: number): Promise<WardEntity | null> {
        try {
            const entities = await this.wardRepository.findOneBy({ code: code });
            return entities;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
