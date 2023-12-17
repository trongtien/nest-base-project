import { ConfigurationService } from 'src/shared/configuration/configuration.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Configuration } from '../../shared/configuration/configuration.enum';
import { type Request } from 'express';
import { ExceptionCustom } from '../../shared/exception/custom.exception';
import AppConstants from '../../shared/constants/app.constants';
import { EnumRolePayloadJwt, TypeContextPayloadToken } from '../../shared/base.type';
import { AdminService } from '../../admin/admin.service';
import { EnumAdminStatusNumber } from '../../admin/admin.type';

@Injectable()
export class AuthAdminJwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(
        private readonly configurationService: ConfigurationService,
        private readonly adminService: AdminService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([AuthAdminJwtAccessTokenStrategy.extractGetHeader]),
            ignoreExpiration: false,
            secretOrKey: configurationService.get(Configuration.JWT_CUSTOMER_ACCESS_SECRET),
        });
    }

    private static extractGetHeader(req: Request): string | null {
        return req.cookies?.[AppConstants.KEY_COOKIE_AUTHENTICATION_ADMIN]
            ? AuthAdminJwtAccessTokenStrategy.extractJWTFromCookie(req)
            : AuthAdminJwtAccessTokenStrategy.extractJWTFromHeader(req);
    }

    private static extractJWTFromHeader(req: Request): string | null {
        if (req.headers && req.headers?.[AppConstants.KEY_COOKIE_AUTHENTICATION]) {
            const tokenFromHeader = (req.headers?.[AppConstants.KEY_COOKIE_AUTHENTICATION] ?? '') as string;

            const stringPath = tokenFromHeader?.replace('Bearer ', '')?.trim();
            return stringPath;
        }
        return null;
    }

    private static extractJWTFromCookie(req: Request): string | null {
        if (req.cookies && req.cookies?.[AppConstants.KEY_COOKIE_AUTHENTICATION_ADMIN]) {
            return req.cookies?.[AppConstants.KEY_COOKIE_AUTHENTICATION_ADMIN];
        }
        return null;
    }

    async validate(context: TypeContextPayloadToken) {
        const { payload } = context;

        // if (AuthUserJwtAccessTokenStrategy.compareExp(context.exp)) {
        //     throw new ExceptionCustom(HttpStatus.UNAUTHORIZED, []);
        // }

        if (payload.role !== EnumRolePayloadJwt.ADMIN) {
            throw new ExceptionCustom(HttpStatus.UNAUTHORIZED, []);
        }

        if (payload.status === EnumAdminStatusNumber.UN_ACTIVE) {
            throw new ExceptionCustom(HttpStatus.UNAUTHORIZED, []);
        }

        const customer = await this.adminService.findOne(payload.id);
        if (customer === null) {
            throw new ExceptionCustom(HttpStatus.UNAUTHORIZED, []);
        }

        return context.payload;
    }

    private static async compareExp(exp: number): Promise<boolean> {
        const dateNow = new Date();
        return exp < dateNow.getTime() / 1000;
    }
}
