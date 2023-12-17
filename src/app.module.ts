import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceModule } from './province/province.module';
import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { DistrictModule } from './district/district.module';
import { WardModule } from './ward/ward.module';
import { UserModule } from './user/user.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { RedisModule } from './shared/redis/redis.module';
import { ConfigurationValidate } from './shared/configuration/configuration.validate';
import { VerifyOtpModule } from './verify-otp/verify-otp.module';
import { AuthAdminModule } from './auth-admin/auth-admin.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        SharedModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development'],
            validationSchema: ConfigurationValidate,
        }),
        RedisModule.registerAsync({
            imports: [SharedModule],
            useFactory: async (configService: ConfigurationService) => ({
                host: configService.get(Configuration.REDIS_CLIENT),
                port: parseInt(configService.get(Configuration.REDIS_PORT)),
                name: configService.get(Configuration.REDIS_USER),
                password: configService.get(Configuration.REDIS_PASSWORD),
            }),
            inject: [ConfigurationService],
        }),
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: async (configService: ConfigurationService) => ({
                type: 'postgres',
                host: configService.get(Configuration.HOST_POSTGRES),
                port: configService.get(Configuration.PORT_POSTGRES)
                    ? parseInt(configService.get(Configuration.PORT_POSTGRES))
                    : undefined,
                password: configService.get(Configuration.PASSWORD_POSTGRES),
                username: configService.get(Configuration.USER_POSTGRES),
                database: configService.get(Configuration.DATABASE_POSTGRES),
                schema: configService.get(Configuration.SCHEMA_POSTGRES),
                synchronize: parseInt(configService.get(Configuration.SYNCHRONIZE_POSTGRES)) === 0 ? false : true,
                logging: false,
                retryDelay: 500,
                retryAttempts: 3,
                entities: [__dirname + '/**/**/*.entity.{js,ts}'],
                migrations: [__dirname + '/../src/migration/**/*.ts'],
                subscribers: [__dirname + '/../src/subscriber/**/*.ts'],
            }),
            inject: [ConfigurationService],
        }),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        ProvinceModule,
        DistrictModule,
        WardModule,
        UserModule,
        AuthUserModule,
        VerifyOtpModule,
        AuthAdminModule,
        AdminModule,
    ],
    exports: [AutomapperModule],
})
export class AppModule {
    static host: string;
    static port: number | string;
    static isDev: boolean;

    constructor(private readonly configurationService: ConfigurationService) {
        AppModule.port = AppModule.normalizePort(configurationService.get(Configuration.PORT));

        AppModule.host = configurationService.get(Configuration.HOST);
        AppModule.isDev = configurationService.isDevelopment;
    }

    private static normalizePort(param: number | string): number | string {
        const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;

        if (isNaN(portNumber)) return param;
        else if (portNumber >= 0) return portNumber;
    }
}
