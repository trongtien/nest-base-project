import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { Repository } from 'typeorm';
import { BaseRepository } from '../shared/base.repository';
import { ProvinceEntity } from './entities/province.entity';
import { TypeQueryAllProvince, TypeResultQueryAllProvince } from './province.type';

@Injectable()
export class ProvinceRepository extends BaseRepository<ProvinceEntity> {
    constructor(@InjectRepository(ProvinceEntity) private readonly provinceRepository: Repository<ProvinceEntity>) {
        super(provinceRepository);
    }

    public async queryAll(option: TypeQueryAllProvince): Promise<TypeResultQueryAllProvince> {
        const { page, limit, name, code } = option;

        const builder = await this.provinceRepository.createQueryBuilder('province');
        if (name) {
            builder.andWhere('province.name like :name', { name: `%${name}%` });
            builder.orWhere('province.slug like :slug', { slug: `%${name}%` });
        }

        if (code && code.length !== 0) {
            builder.andWhere('province.code IN (:...code)', { code: [...code] });
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
        const items = await builder.orderBy('province.createdAt', 'ASC').getMany();

        return {
            items: items as ProvinceEntity[],
            limit: limit ? limit : total,
            page: page || 1,
            totalItemCount: total,
        };
    }

    public async findByCode(code: number): Promise<ProvinceEntity | null> {
        try {
            const entities = await this.provinceRepository.findOneBy({ code: code });
            return entities;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
