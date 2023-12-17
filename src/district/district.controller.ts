import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { DistrictService } from './district.service';
import { ApiTags } from '@nestjs/swagger';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ToNumberPipe } from 'src/shared/pipes/toNumber.pipe';
import { BadRequestCustom } from 'src/shared/exception/badRequest.exception';
import { DistrictEntity } from './entities/district.entity';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { DistrictView } from './view/district.view';
import { DistrictGetAllDto } from './dto/districtGetAll.dto';
import AppConstants from '../shared/constants/app.constants';

@Controller('district')
@ApiTags('District')
export class DistrictController {
    constructor(
        private readonly districtService: DistrictService,
        @InjectMapper() private readonly automapper: Mapper,
    ) {}

    @Get()
    async findAll(@Query() params: DistrictGetAllDto) {
        try {
            const { province_code: provinceCode, code, name, page, limit } = params;

            if (!provinceCode || provinceCode === null) {
                throw new BadRequestCustom(AppConstants.MESSAGE_REQUIRE_PROVINCE);
            }

            const district = await this.districtService.findAll(provinceCode, page, limit, code, name);

            const _mapperDistrict = await this.automapper.mapArray(district.items, DistrictEntity, DistrictView);

            return {
                ...district,
                items: _mapperDistrict,
            };
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Get('/service-get-by-code')
    async serviceGetByCode(@Query() params: DistrictGetAllDto) {
        try {
            const { province_code: provinceCode, code, name, page, limit } = params;

            if (!provinceCode || provinceCode === null) {
                throw new BadRequestCustom(AppConstants.MESSAGE_REQUIRE_PROVINCE);
            }

            const result = await this.districtService.findAll(provinceCode, page, limit, code, name);
            const mapperItem = new Map<number, DistrictView>();

            const districts = result.items || [];
            for (const district of districts) {
                const _mapperDistrict = await this.automapper.map(district, DistrictEntity, DistrictView);
                mapperItem.set(_mapperDistrict.code, _mapperDistrict);
            }

            return mapperItem.size === 0 ? null : Object.fromEntries(mapperItem);
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Get(':code')
    async findOne(@Param('code', new ToNumberPipe()) code: number) {
        try {
            if (!code || isNaN(code)) {
                throw new BadRequestCustom(AppConstants.MESSAGE_REQUIRE_DISTRICT_OR_TYPE);
            }

            const district = await this.districtService.findOne(code);

            const _mapperDistrict = await this.automapper.map(district, DistrictEntity, DistrictView);

            return _mapperDistrict;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
