import { HttpStatus, Injectable } from '@nestjs/common';
import AppConstants from './constants/app.constants';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { EnumRolePayloadJwt } from './base.type';

@Injectable()
export default class BaseHttView {
    @ApiPropertyOptional() http_status: number = HttpStatus.OK;
    @ApiPropertyOptional() data: any = null;
    @ApiPropertyOptional() message: string = AppConstants.MESSAGE_SEVER_SUCCESS;
    @ApiPropertyOptional() error: any = [];

    constructor(ctx?: BaseHttView) {
        if (ctx) {
            Object.assign(this, ctx);
        }
        return this;
    }
}

export class AuthPayloadJwtView {
    @AutoMap()
    @Expose()
    id: string;

    @AutoMap()
    @Expose()
    fullName: string;

    @AutoMap()
    @Expose()
    phone: string;

    @AutoMap()
    @Expose()
    email: string;

    @AutoMap()
    @Expose()
    point: number;

    @AutoMap()
    @Expose()
    status: number;

    @AutoMap()
    @Expose()
    role: EnumRolePayloadJwt;

    @AutoMap()
    @Expose()
    isVerify: number;

    @AutoMap()
    @Expose()
    tokenFcm: string | null;

    @AutoMap()
    @Expose()
    deviceId: string | null;

    @AutoMap()
    @Expose()
    username: string | null;
}
