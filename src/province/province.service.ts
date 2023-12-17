import { HttpStatus, Injectable } from '@nestjs/common';
import { ProvinceRepository } from './province.repository';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { ProvinceEntity } from './entities/province.entity';
import { TypeResultQueryAllProvince } from './province.type';
import { RedisService } from 'src/shared/redis/redis.service';
import AppConstants from 'src/shared/constants/app.constants';
import { ConvertString } from '../shared/utils/convertString';

@Injectable()
export class ProvinceService {
    constructor(
        private readonly _provinceRepository: ProvinceRepository,
        private readonly redisService: RedisService,
        private readonly convertString: ConvertString,
    ) {}

    async findAll(page?: number, limit?: number, code?: string, name?: string): Promise<TypeResultQueryAllProvince> {
        try {
            const cacheProvinceKey = await this.redisService.keyCache(AppConstants.KEY_REDIS_PROVINCE, {
                page: page,
                limit: limit,
                code: code,
                name: name,
            });

            const cacheProvince = await this.redisService.get(cacheProvinceKey);

            if (cacheProvince !== null) {
                return JSON.parse(cacheProvince);
            }

            const province = await this._provinceRepository.queryAll({
                code: code ? this.convertString.convertQueryStringToArray(code) : [],
                name: name,
                limit: limit,
                page: page,
            });

            const exSecondCache = !page && !limit && !code && !name ? undefined : 30;

            this.redisService.set(cacheProvinceKey, JSON.stringify(province), exSecondCache);

            return province;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findOne(code: number): Promise<ProvinceEntity> {
        try {
            const province = await this._provinceRepository.findByCode(code);

            if (province === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Code province does not exist');
            }

            return province;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
