import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ApiTags } from '@nestjs/swagger';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ProvinceEntity } from './entities/province.entity';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { BadRequestCustom } from 'src/shared/exception/badRequest.exception';
import { ProvinceViewAll } from './view/province.view';
import { ProvinceGetAllDto } from './dto/provinceGetAll.dto';

@Controller('province')
@ApiTags('Province')
export class ProvinceController {
    constructor(
        private readonly provinceService: ProvinceService,
        @InjectMapper() private readonly automapper: Mapper,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() params: ProvinceGetAllDto) {
        try {
            const { page, limit, code, name } = params;

            const province = await this.provinceService.findAll(page, limit, code, name);

            const _mapperProvince = await this.automapper.mapArray(province.items, ProvinceEntity, ProvinceViewAll);

            return {
                ...province,
                items: _mapperProvince,
            };
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/service-get-by-code')
    async serviceGetByCode(@Query() params: ProvinceGetAllDto) {
        try {
            const { page, limit, code, name } = params;

            const result = await this.provinceService.findAll(page, limit, code, name);

            // Mapper response return data
            const mapperItem = new Map<number, ProvinceViewAll>();

            const provinceItems = result?.items || [];
            for (const province of provinceItems) {
                const _mapperProvince = await this.automapper.map(province, ProvinceEntity, ProvinceViewAll);

                mapperItem.set(province.code, _mapperProvince);
            }

            return mapperItem.size === 0 ? null : Object.fromEntries(mapperItem);
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Get(':code')
    async findOne(@Param('code') code: number) {
        try {
            if (!code || isNaN(code)) {
                throw new BadRequestCustom('Code province is required or type number');
            }

            const province = await this.provinceService.findOne(code);

            const _mapperProvince = await this.automapper.map(province, ProvinceEntity, ProvinceViewAll);

            return _mapperProvince;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
