import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DistrictModule } from 'src/district/district.module';
import { ProvinceModule } from 'src/province/province.module';
import { ConfigurationService } from 'src/shared/configuration/configuration.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { WardModule } from 'src/ward/ward.module';
import { Configuration } from './../shared/configuration/configuration.enum';
import { AuthUserController } from './auth-user.controller';
import { AuthUserService } from './auth-user.service';
import { AuthRegisterProfile } from './profile/auth-register.profile';
import { AuthPayloadJwtProfile } from './profile/auth-jwt-payload.profile';
import { LocalAuthUserStrategy } from './strategy/auth-user.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthLoginProfile } from './profile/auth-login.profile';
import { JwtAccessTokenGuard } from './guard/auth-user-jwt-access-token.guard';
import { AuthUserJwtAccessTokenStrategy } from './strategy/auth-user-jwt-access-token';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [SharedModule],
            useFactory: async (_configService: ConfigurationService) => ({
                global: true,
                secret: _configService.get(Configuration.JWT_CUSTOMER_ACCESS_SECRET),
                signOptions: { expiresIn: _configService.get(Configuration.JWT_CUSTOMER_ACCESS_EXPIRATION_TIME) },
            }),
            inject: [ConfigurationService],
        }),
        UserModule,
        ProvinceModule,
        DistrictModule,
        WardModule,
    ],
    controllers: [AuthUserController],
    providers: [
        AuthUserService,
        AuthPayloadJwtProfile,
        AuthRegisterProfile,
        AuthLoginProfile,
        LocalAuthUserStrategy,
        AuthUserJwtAccessTokenStrategy,
        JwtAccessTokenGuard,
    ],
})
export class AuthUserModule {}
