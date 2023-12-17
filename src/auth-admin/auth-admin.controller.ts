import { Controller, Post, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthAdminGuard } from './guard/auth-admin.guard';
import { LoginAuthAdminDTO } from './dto/login-auth-admin.dto';
import AppConstants from '../shared/constants/app.constants';
import { ExceptionCustom } from '../shared/exception/custom.exception';
import { AdminEntity } from '../admin/entities/admin.entity';
import { InjectMapper } from '@automapper/nestjs';
import { ValidateFieldService } from '../shared/validateField/validate-field.service';
import { Mapper } from '@automapper/core';
import { AuthAdminLoginView } from './view/auth-admin-login.view';
import { JwtAdminAccessTokenGuard } from './guard/auth-admin-access-token.guard';
import { CurrentAdmin } from './decorator/auth-get-admin.decorator';
import { AuthPayloadJwtView } from '../shared/baseHttp.view';

@Controller('admin/auth')
@ApiTags('Authentication Admin')
export class AuthAdminController {
    constructor(
        private readonly authAdminService: AuthAdminService,
        private readonly validateFieldService: ValidateFieldService,
        @InjectMapper() private readonly automapper: Mapper,
    ) {}

    @Post('/login')
    @UseGuards(LocalAuthAdminGuard)
    async login(@Req() request: any, @Res({ passthrough: true }) res: Response, @Body() _: LoginAuthAdminDTO) {
        try {
            const { user } = request;
            const customer = await this.authAdminService.generatorTokenSignIn(user);

            res.cookie(AppConstants.KEY_COOKIE_AUTHENTICATION_ADMIN, `${customer.token}`, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });

            const mappingLoginView = await this.automapper.map(customer, AdminEntity, AuthAdminLoginView);
            return mappingLoginView;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('/logout')
    @UseGuards(JwtAdminAccessTokenGuard)
    async logOut(@CurrentAdmin() currentUser: AuthPayloadJwtView, @Res({ passthrough: true }) res: Response) {
        try {
            await this.authAdminService.clearTokenAdmin(currentUser);
            res.clearCookie(AppConstants.KEY_COOKIE_AUTHENTICATION_ADMIN);

            return currentUser;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
