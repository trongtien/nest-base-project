import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { AdminModule } from '../admin/admin.module';
import { AuthAdminLoginProfile } from './profile/auth-admin-login.profile';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { Configuration } from '../shared/configuration/configuration.enum';
import { SharedModule } from '../shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthAdminStrategy } from './strategy/auth-admin-local.strategy';
import { AuthAdminJwtAccessTokenStrategy } from './strategy/auth-admin-jwt-access-token.strategy';
import { AuthAdminPayloadJwtProfile } from './profile/auth-admin-jwt-payload.profile';

@Module({
    imports: [
        PassportModule,
        AdminModule,
        JwtModule.registerAsync({
            imports: [SharedModule],
            useFactory: async (_configService: ConfigurationService) => ({
                global: true,
                secret: _configService.get(Configuration.JWT_ADMIN_ACCESS_SECRET),
                signOptions: {
                    expiresIn: parseInt(_configService.get(Configuration.JWT_ADMIN_ACCESS_EXPIRATION_TIME)),
                },
            }),
            inject: [ConfigurationService],
        }),
    ],
    controllers: [AuthAdminController],
    providers: [
        AuthAdminService,
        AuthAdminLoginProfile,
        AuthAdminPayloadJwtProfile,
        LocalAuthAdminStrategy,
        AuthAdminJwtAccessTokenStrategy,
    ],
})
export class AuthAdminModule {}
