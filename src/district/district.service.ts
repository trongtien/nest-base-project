import { HttpStatus, Injectable } from '@nestjs/common';
import { DistrictRepository } from './district.repository';
import { DistrictEntity } from './entities/district.entity';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { TypeResultQueryAll } from './district.type';
import { RedisService } from 'src/shared/redis/redis.service';
import AppConstants from 'src/shared/constants/app.constants';
import { ConvertString } from '../shared/utils/convertString';

@Injectable()
export class DistrictService {
    constructor(
        private readonly _districtRepository: DistrictRepository,
        private readonly redisService: RedisService,
        private readonly convertString: ConvertString,
    ) {}

    async findAll(
        provinceCode: number,
        page?: number,
        limit?: number,
        code?: string,
        name?: string,
    ): Promise<TypeResultQueryAll> {
        try {
            const cacheDistrictKey = await this.redisService.keyCache(AppConstants.KEY_REDIS_DISTRICT, {
                provinceCode: provinceCode,
                page: page,
                limit: limit,
                code: code,
                name: name,
            });
            const cacheDistrict = await this.redisService.get(cacheDistrictKey);

            if (cacheDistrict !== null) {
                return JSON.parse(cacheDistrict);
            }

            const districts = await this._districtRepository.queryAll({
                provinceCode: provinceCode,
                code: code ? this.convertString.convertQueryStringToArray(code) : [],
                name: name,
                limit: limit,
                page: page,
            });

            this.redisService.set(cacheDistrictKey, JSON.stringify(districts), 30);

            return districts;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findOne(code: number): Promise<DistrictEntity> {
        try {
            const district = await this._districtRepository.findByCode(code);

            if (district === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Code district does not exist');
            }

            return district;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
