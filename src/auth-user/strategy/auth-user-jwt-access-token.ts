import { UserService } from 'src/user/user.service';
import { ConfigurationService } from 'src/shared/configuration/configuration.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Configuration } from '../../shared/configuration/configuration.enum';
import { type Request } from 'express';
import { ExceptionCustom } from '../../shared/exception/custom.exception';
import AppConstants from '../../shared/constants/app.constants';
import { TypeContextPayloadToken } from '../../shared/base.type';

@Injectable()
export class AuthUserJwtAccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configurationService: ConfigurationService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([AuthUserJwtAccessTokenStrategy.extractGetHeader]),
            ignoreExpiration: false,
            secretOrKey: configurationService.get(Configuration.JWT_CUSTOMER_ACCESS_SECRET),
        });
    }

    private static extractGetHeader(req: Request): string | null {
        return req.cookies?.[AppConstants.KEY_COOKIE_AUTHENTICATION]
            ? AuthUserJwtAccessTokenStrategy.extractJWTFromCookie(req)
            : AuthUserJwtAccessTokenStrategy.extractJWTFromHeader(req);
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
        if (req.cookies && req.cookies?.[AppConstants.KEY_COOKIE_AUTHENTICATION]) {
            return req.cookies?.[AppConstants.KEY_COOKIE_AUTHENTICATION];
        }
        return null;
    }

    async validate(context: TypeContextPayloadToken) {
        const { payload } = context;

        // if (AuthUserJwtAccessTokenStrategy.compareExp(context.exp)) {
        //     throw new ExceptionCustom(HttpStatus.UNAUTHORIZED, []);
        // }

        const customer = await this.userService.findOne(payload.id);
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
