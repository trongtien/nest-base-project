import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { ValidateFieldService } from '../shared/validateField/validate-field.service';
import { EncryptService } from '../shared/utils/encrypt.service';
import { AdminService } from '../admin/admin.service';
import { AdminEntity } from '../admin/entities/admin.entity';
import { EnumAdminStatusNumber } from '../admin/admin.type';
import { ExceptionCustom } from '../shared/exception/custom.exception';
import { AuthPayloadJwtView } from '../shared/baseHttp.view';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Configuration } from '../shared/configuration/configuration.enum';

@Injectable()
export class AuthAdminService {
    constructor(
        @InjectMapper() private readonly automapper: Mapper,
        private readonly jwtService: JwtService,
        private readonly configurationService: ConfigurationService,
        private readonly validateFieldService: ValidateFieldService,
        private readonly encryptService: EncryptService,
        private readonly adminService: AdminService,
    ) {}

    async validateUser(username: string, password: string): Promise<AdminEntity> {
        try {
            const adminEntity = await this.adminService.verifyAuthenticationUser(username.trim());

            if (adminEntity === null) {
                return null;
            }

            const verifyComparPassword = await this.encryptService.comparePassword(
                password.trim(),
                adminEntity.password,
            );

            if (!verifyComparPassword) {
                return null;
            }

            if (adminEntity.status === EnumAdminStatusNumber.UN_ACTIVE) {
                return null;
            }

            return adminEntity;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async generatorTokenSignIn(context: AdminEntity): Promise<AdminEntity> {
        try {
            let adminEntity = new AdminEntity();
            adminEntity = Object.assign(adminEntity, context);
            const mappingAuthPayloadJwt = await this.automapper.map(adminEntity, AdminEntity, AuthPayloadJwtView);

            const token = await this.jwtService.signAsync({
                payload: mappingAuthPayloadJwt,
                expiresIn: parseInt(this.configurationService.get(Configuration.JWT_ADMIN_ACCESS_EXPIRATION_TIME)),
                secretKey: this.configurationService.get(Configuration.JWT_ADMIN_ACCESS_SECRET),
            });

            const tokenRefresh = await this.jwtService.signAsync({
                payload: mappingAuthPayloadJwt,
                expiresIn: parseInt(this.configurationService.get(Configuration.JWT_ADMIN_ACCESS_EXPIRATION_TIME)),
                secretKey: this.configurationService.get(Configuration.JWT_ADMIN_ACCESS_SECRET_REFRESH),
            });

            adminEntity.token = token;
            adminEntity.refreshToken = tokenRefresh;
            await this.adminService.update(adminEntity);

            return adminEntity;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async clearTokenAdmin(currentUser: AuthPayloadJwtView): Promise<true> {
        try {
            const adminEntity = await this.adminService.findOne(currentUser.id);
            if (adminEntity === null) {
                throw new BadGatewayException('Customer not fount');
            }

            adminEntity.token = null;
            adminEntity.refreshToken = null;
            adminEntity.deviceId = null;
            adminEntity.tokenFcm = null;

            await this.adminService.update(adminEntity);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
