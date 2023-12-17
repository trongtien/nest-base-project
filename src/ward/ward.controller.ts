import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { WardService } from './ward.service';
import { ApiTags } from '@nestjs/swagger';
import { WardGetAllDto } from './dto/WardGetAllDto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BadRequestCustom } from 'src/shared/exception/badRequest.exception';
import { WardEntity } from './entities/ward.entity';
import { WardView } from './view/ward.view';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { ToNumberPipe } from 'src/shared/pipes/toNumber.pipe';

@Controller('ward')
@ApiTags('Ward')
export class WardController {
    constructor(private readonly wardService: WardService, @InjectMapper() private readonly automapper: Mapper) {}

    @Get()
    async findAll(@Query() params: WardGetAllDto) {
        try {
            const { district_code: districtCode, code, name, page, limit } = params;

            if (!districtCode || districtCode === null) {
                throw new BadRequestCustom('Province code is require');
            }

            const wards = await this.wardService.findAll(districtCode, page, limit, code, name);

            const mapperWards = await this.automapper.mapArray(wards.items, WardEntity, WardView);

            return {
                ...wards,
                items: mapperWards,
            };
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Get('/service-get-by-code')
    async serviceGetByCode(@Query() params: WardGetAllDto) {
        try {
            const { district_code: districtCode, code, name, page, limit } = params;

            if (!districtCode || districtCode === null) {
                throw new BadRequestCustom('Province code is require');
            }

            const result = await this.wardService.findAll(districtCode, page, limit, code, name);

            // Mapper response return data
            const mapperItem = new Map<number, WardView>();

            const wardItems = result?.items || [];
            for (const ward of wardItems) {
                const mapperWards = await this.automapper.map(ward, WardEntity, WardView);
                mapperItem.set(mapperWards.code, mapperWards);
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
                throw new BadRequestCustom('Code ward is require or type number');
            }

            const ward = await this.wardService.findOne(code);

            const mapperWard = await this.automapper.map(ward, WardEntity, WardView);

            return mapperWard;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
