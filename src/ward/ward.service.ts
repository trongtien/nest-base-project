import { HttpStatus, Injectable } from '@nestjs/common';
import { WardEntity } from './entities/ward.entity';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { WardRepository } from './ward.repository';
import { TypeResultQueryAllProvince } from './ward.type';
import { RedisService } from 'src/shared/redis/redis.service';
import AppConstants from 'src/shared/constants/app.constants';
import { ConvertString } from '../shared/utils/convertString';

@Injectable()
export class WardService {
    constructor(
        private readonly _wardRepository: WardRepository,
        private readonly redisService: RedisService,
        private readonly convertString: ConvertString,
    ) {}

    async findAll(
        districtCode: number,
        page?: number,
        limit?: number,
        code?: string,
        name?: string,
    ): Promise<TypeResultQueryAllProvince> {
        try {
            const cacheWardKey = await this.redisService.keyCache(AppConstants.KEY_REDIS_WARD, {
                districtCode: districtCode,
                page: page,
                limit: limit,
                code: code,
                name: name,
            });

            const cacheWard = await this.redisService.get(cacheWardKey);

            if (cacheWard !== null) {
                return JSON.parse(cacheWard);
            }

            const wards = await this._wardRepository.queryAll({
                districtCode: districtCode,
                code: code ? this.convertString.convertQueryStringToArray(code) : [],
                name: name,
                limit: limit,
                page: page,
            });

            this.redisService.set(cacheWardKey, JSON.stringify(wards), 30);

            return wards;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findOne(code: number): Promise<WardEntity> {
        try {
            const ward = await this._wardRepository.findByCode(code);
            if (ward === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Code ward does not exist');
            }
            return ward;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
