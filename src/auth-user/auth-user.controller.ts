import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { RegisterAuthUserDTO } from './dto/register-auth-user.dto';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ApiTags } from '@nestjs/swagger';
import { ValidateRequestException } from 'src/shared/exception/validateRequest.exception';
import { EnumValidateField } from 'src/shared/validateField/validate-field.enum';
import { ValidateFieldService } from 'src/shared/validateField/validate-field.service';
import { CustomerEntity } from '../user/entities/customer.entity';
import { AuthRegisterView } from './view/auth-register.view';
import { LocalAuthUserGuard } from './guard/auth-user.guard';
import { AuthLoginView } from './view/auth-login.view';
import { Response } from 'express';
import AppConstants from '../shared/constants/app.constants';
import { JwtAccessTokenGuard } from './guard/auth-user-jwt-access-token.guard';
import { CurrentUser } from './decorator/auth-get-user.decorator';
import { ExceptionCustom } from '../shared/exception/custom.exception';
import { LoginAuthUserDTO } from './dto/login-auth-user.dto';
import { RefreshTokenUserAuthDto } from './dto/refresh-token-auth-user.dto';
import { AuthPayloadJwtView } from '../shared/baseHttp.view';

@Controller('/auth')
@ApiTags('Authentication Customer')
export class AuthUserController {
    constructor(
        private readonly authUserService: AuthUserService,
        private readonly validateFieldService: ValidateFieldService,
        @InjectMapper() private readonly automapper: Mapper,
    ) {}

    @Post('/register')
    async register(@Body() registerAuthUserDTO: RegisterAuthUserDTO) {
        try {
            const isComparePassword = await this.validateFieldService.isCompareConfirmPassword(
                registerAuthUserDTO?.password,
                registerAuthUserDTO?.confirm_password,
            );

            if (!isComparePassword) {
                throw new ValidateRequestException([
                    this.validateFieldService.get(EnumValidateField.INVALID_NOT_MATCH_PASSWORD, 'confirm_password'),
                ]);
            }

            const createUser = await this.authUserService.register(registerAuthUserDTO);

            const mappingRegisterUser = await this.automapper.map(createUser, CustomerEntity, AuthRegisterView);

            return mappingRegisterUser;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('/login')
    @UseGuards(LocalAuthUserGuard)
    async login(@Req() request: any, @Res({ passthrough: true }) res: Response, @Body() _: LoginAuthUserDTO) {
        try {
            const { user } = request;
            const customer = await this.authUserService.generatorTokenSignIn(user);

            res.cookie(AppConstants.KEY_COOKIE_AUTHENTICATION, `${customer.token}`, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });

            const mappingLoginView = await this.automapper.map(customer, CustomerEntity, AuthLoginView);
            return mappingLoginView;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('/refresh-token')
    @UseGuards(JwtAccessTokenGuard)
    async refreshToken(
        @CurrentUser() currentUser: AuthPayloadJwtView,
        @Res({ passthrough: true }) res: Response,
        @Body() refreshTokenUser: RefreshTokenUserAuthDto,
    ) {
        try {
            const customerRefresh = await this.authUserService.validateRefreshUser(refreshTokenUser, currentUser);

            res.cookie(AppConstants.KEY_COOKIE_AUTHENTICATION, `${customerRefresh.token}`, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });

            const mappingLoginView = await this.automapper.map(customerRefresh, CustomerEntity, AuthLoginView);
            return mappingLoginView;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('/logout')
    @UseGuards(JwtAccessTokenGuard)
    async logOut(@CurrentUser() currentUser: AuthPayloadJwtView, @Res({ passthrough: true }) res: Response) {
        try {
            await this.authUserService.clearTokenCustomer(currentUser);
            res.clearCookie(AppConstants.KEY_COOKIE_AUTHENTICATION);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
