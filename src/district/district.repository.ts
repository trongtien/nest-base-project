import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { Repository } from 'typeorm';
import { BaseRepository } from '../shared/base.repository';
import { TypeQueryAllDistrict, TypeResultQueryAll } from './district.type';
import { DistrictEntity } from './entities/district.entity';

@Injectable()
export class DistrictRepository extends BaseRepository<DistrictEntity> {
    constructor(@InjectRepository(DistrictEntity) private readonly districtRepository: Repository<DistrictEntity>) {
        super(districtRepository);
    }

    public async queryAll(option: TypeQueryAllDistrict): Promise<TypeResultQueryAll> {
        const { page, limit, name, code, provinceCode } = option;

        const builder = await this.districtRepository.createQueryBuilder('district');

        if (provinceCode) {
            builder.andWhere('district.provinceCode = :provinceCode', { provinceCode: provinceCode });
        }

        if (name) {
            builder.andWhere('district.name like :name', { name: `%${name}%` });
            builder.orWhere('district.slug like :slug', { slug: `%${name}%` });
        }

        if (code && code.length !== 0) {
            builder.andWhere('district.code IN (:...code)', { code: [...code] });
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
        const items = await builder.orderBy('district.createdAt', 'ASC').getMany();

        return {
            items: items as DistrictEntity[],
            limit: limit ? limit : total,
            page: page || 1,
            totalItemCount: total,
        };
    }

    public async findByCode(code: number): Promise<DistrictEntity | null> {
        try {
            const entities = await this.districtRepository.findOneBy({ code: code });
            return entities;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
