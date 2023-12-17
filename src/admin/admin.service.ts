import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { ExceptionCustom } from '../shared/exception/custom.exception';
import AppConstants from '../shared/constants/app.constants';
import { RedisService } from '../shared/redis/redis.service';
import { ValidateRequestException } from '../shared/exception/validateRequest.exception';
import { ValidateFieldService } from '../shared/validateField/validate-field.service';
import { EnumValidateField } from '../shared/validateField/validate-field.enum';
import { EncryptService } from '../shared/utils/encrypt.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly redisService: RedisService,
        private readonly validateFieldService: ValidateFieldService,
        private readonly encryptService: EncryptService,
    ) {}

    async create(context: RegisterAdminDto): Promise<boolean> {
        try {
            const validFromUsername = await this.adminRepository.findByUsername(context.username);

            if (validFromUsername !== null) {
                throw new ValidateRequestException([
                    this.validateFieldService.get(EnumValidateField.INVALID_EXIST_EMAIL_USERNAME_ADMIN, 'username'),
                ]);
            }

            const encryptPassword = await this.encryptService.generatorPassword(context.password?.trim());

            const adminEntity = new AdminEntity();
            adminEntity.password = encryptPassword;
            adminEntity.username = context.username.trim();
            adminEntity.status = context.status;
            adminEntity.createdBy = 'system';
            adminEntity.modifyBy = 'system';

            await this.adminRepository.save(adminEntity);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async verifyAuthenticationUser(username: string): Promise<AdminEntity | null> {
        try {
            const customer = await this.adminRepository.findAuthentication(username);

            return customer;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async update(admin: AdminEntity): Promise<boolean> {
        try {
            const adminEntity = await this.adminRepository.getById(admin.id);

            if (adminEntity === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Id user not found');
            }

            await this.adminRepository.update(admin.id, adminEntity);

            this.updateRedisAdmin(adminEntity);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async findOne(id: string): Promise<AdminEntity> {
        try {
            const cacheKey = `${AppConstants.KEY_REDIS_ADMIN}_${id}`;
            const cacheAdmin = await this.redisService.get(cacheKey);

            if (cacheAdmin !== null) {
                return JSON.parse(cacheAdmin);
            }

            const user = await this.adminRepository.getById(id);

            if (user === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Id user not found');
            }

            this.updateRedisAdmin(user);

            return user;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    private async updateRedisAdmin(admin: AdminEntity) {
        const cacheKey = `${AppConstants.KEY_REDIS_ADMIN}_${admin.id}`;
        this.redisService.set(cacheKey, JSON.stringify(admin), AppConstants.KEY_REDIS_USER_EX);
    }
}
