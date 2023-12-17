import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { CustomerEntity } from './entities/customer.entity';
import { UserRepository } from './user.repository';
import { RedisService } from '../shared/redis/redis.service';
import AppConstants from '../shared/constants/app.constants';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ChangePasswordDto } from './dto/update-password.dto';
import { EncryptService } from '../shared/utils/encrypt.service';
import { TypeValidateField } from '../shared/validateField/validate-field.type';
import { ValidateFieldService } from '../shared/validateField/validate-field.service';
import { EnumValidateField } from '../shared/validateField/validate-field.enum';
import { ValidateRequestException } from '../shared/exception/validateRequest.exception';
import { AuthPayloadJwtView } from '../shared/baseHttp.view';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly redisService: RedisService,
        private readonly encryptService: EncryptService,
        private readonly validateFieldService: ValidateFieldService,
    ) {}

    async findOne(id: string): Promise<CustomerEntity> {
        try {
            const cacheKey = `${AppConstants.KEY_REDIS_USER}_${id}`;
            const cacheUser = await this.redisService.get(cacheKey);

            if (cacheUser !== null) {
                return JSON.parse(cacheUser);
            }

            const user = await this.userRepository.getById(id);

            if (user === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Id user not found');
            }

            this.updateRedisUser(user);

            return user;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async update(customer: CustomerEntity): Promise<boolean> {
        try {
            const user = await this.userRepository.getById(customer.id);

            if (user === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Id user not found');
            }

            await this.userRepository.update(customer.id, customer);

            this.updateRedisUser(user);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async updateDevice(currentUser: AuthPayloadJwtView, registerDeviceDto: RegisterDeviceDto): Promise<boolean> {
        try {
            await this.userRepository.update(currentUser.id, {
                deviceId: registerDeviceDto?.device_id ?? null,
                tokenFcm: registerDeviceDto.token_fcm,
            });

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async verifyAuthenticationUser(username: string): Promise<CustomerEntity | null> {
        try {
            const customer = await this.userRepository.findAuthentication(username);

            return customer;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async insert(customer: CustomerEntity): Promise<CustomerEntity> {
        try {
            const user = await this.userRepository.save(customer);

            return user;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async validateExistInfo(email: string, phone: string): Promise<any> {
        try {
            const [existEmail, existPhone] = await Promise.all([
                this.userRepository.findByEmail(email),
                this.userRepository.findByPhone(phone),
            ]);

            return [existEmail, existPhone];
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async updatePassword(currentUser: AuthPayloadJwtView, changePasswordDto: ChangePasswordDto): Promise<boolean> {
        try {
            const user = await this.findOne(currentUser.id);

            if (user === null) {
                throw new ExceptionCustom(HttpStatus.BAD_REQUEST, 'Id user not found');
            }

            const validateFormDto = await this.validateUpdatePassword(changePasswordDto, user);
            if (validateFormDto.length) {
                throw new ValidateRequestException(validateFormDto);
            }

            const encryptPassword = await this.encryptService.generatorPassword(changePasswordDto?.password?.trim());

            user.password = encryptPassword;
            user.modifyBy = currentUser.fullName;
            user.token = null;
            user.refreshToken = null;

            await this.userRepository.update(currentUser.id, user);

            this.updateRedisUser(user);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    private async validateUpdatePassword(
        changePasswordDto: ChangePasswordDto,
        user: CustomerEntity,
    ): Promise<TypeValidateField[]> {
        const validateFormUpdatePassword: TypeValidateField[] = [];

        const isComparePassword = await this.encryptService.comparePassword(
            changePasswordDto.current_password,
            user.password,
        );
        !isComparePassword &&
            validateFormUpdatePassword.push(
                this.validateFieldService.get(EnumValidateField.INVALID_CURRENT_PASSWORD, 'current_password'),
            );

        if (changePasswordDto.confirm_password !== changePasswordDto.password) {
            validateFormUpdatePassword.push(
                this.validateFieldService.get(EnumValidateField.INVALID_CURRENT_CONFIRM_PASSWORD, 'confirm_password'),
            );
        }

        return validateFormUpdatePassword;
    }

    private async updateRedisUser(user: CustomerEntity) {
        const cacheKey = `${AppConstants.KEY_REDIS_USER}_${user.id}`;
        this.redisService.set(cacheKey, JSON.stringify(user), AppConstants.KEY_REDIS_USER_EX);
    }
}
