import { Configuration } from './../shared/configuration/configuration.enum';
import { EncryptService } from './../shared/utils/encrypt.service';
import { DistrictService } from './../district/district.service';
import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthUserDTO } from './dto/register-auth-user.dto';
import { ProvinceService } from 'src/province/province.service';
import { WardService } from 'src/ward/ward.service';
import { UserService } from 'src/user/user.service';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { TypeResultValidateInfoUser, TypeValidateInfoUser } from './auth-user.type';
import { TypeValidateField } from 'src/shared/validateField/validate-field.type';
import { ValidateFieldService } from 'src/shared/validateField/validate-field.service';
import { EnumValidateField } from 'src/shared/validateField/validate-field.enum';
import { ValidateRequestException } from 'src/shared/exception/validateRequest.exception';
import { CustomerInfoEntity } from 'src/user/entities/customer-info.entity';
import { CustomerEntity } from 'src/user/entities/customer.entity';
import { EIsVerify, EStatusNumber } from 'src/user/user.type';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenUserAuthDto } from './dto/refresh-token-auth-user.dto';
import { VerifyEmailDto } from '../verify-otp/dto/verify-email.dto';
import { AuthPayloadJwtView } from '../shared/baseHttp.view';
import { ConvertString } from '../shared/utils/convertString';

@Injectable()
export class AuthUserService {
    constructor(
        @InjectMapper() private readonly automapper: Mapper,
        private readonly jwtService: JwtService,
        private readonly configurationService: ConfigurationService,
        private readonly provinceService: ProvinceService,
        private readonly districtService: DistrictService,
        private readonly wardService: WardService,
        private readonly useService: UserService,
        private readonly validateFieldService: ValidateFieldService,
        private readonly encryptService: EncryptService,
        private readonly convertString: ConvertString,
    ) {}

    async validateUser(username: string, password: string): Promise<CustomerEntity> {
        try {
            const customer = await this.useService.verifyAuthenticationUser(username.trim());

            if (customer === null) {
                return null;
            }

            const verifyComparPassword = await this.encryptService.comparePassword(password.trim(), customer.password);

            if (!verifyComparPassword) {
                return null;
            }

            if (customer.status === EStatusNumber.UN_ACTIVE) {
                return null;
            }

            return customer;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async validateRefreshUser(
        refreshToken: RefreshTokenUserAuthDto,
        currentUser: AuthPayloadJwtView,
    ): Promise<CustomerEntity> {
        try {
            const customer = await this.useService.findOne(currentUser.id);

            if (customer === null && refreshToken.refresh_token === customer.refreshToken) {
                throw new BadGatewayException('Customer not fount');
            }

            return await this.generatorTokenSignIn(customer);
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async generatorTokenSignIn(context: CustomerEntity): Promise<CustomerEntity> {
        try {
            let customerEntity = new CustomerEntity();
            customerEntity = Object.assign(customerEntity, context);
            const mappingAuthPayloadJwt = await this.automapper.map(customerEntity, CustomerEntity, AuthPayloadJwtView);

            const token = await this.jwtService.signAsync({
                payload: mappingAuthPayloadJwt,
                expiresIn: this.configurationService.get(Configuration.JWT_CUSTOMER_ACCESS_EXPIRATION_TIME),
                secretKey: this.configurationService.get(Configuration.JWT_CUSTOMER_ACCESS_SECRET),
            });

            const tokenRefresh = await this.jwtService.signAsync({
                payload: mappingAuthPayloadJwt,
                expiresIn: this.configurationService.get(Configuration.JWT_CUSTOMER_ACCESS_EXPIRATION_TIME),
                secretKey: this.configurationService.get(Configuration.JWT_CUSTOMER_ACCESS_SECRET_REFRESH),
            });

            customerEntity.token = token;
            customerEntity.refreshToken = tokenRefresh;
            await this.useService.update(customerEntity);

            return customerEntity;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async clearTokenCustomer(currentUser: AuthPayloadJwtView): Promise<true> {
        try {
            const customer = await this.useService.findOne(currentUser.id);
            if (customer === null) {
                throw new BadGatewayException('Customer not fount');
            }

            customer.token = null;
            customer.refreshToken = null;
            customer.deviceId = null;
            customer.tokenFcm = null;

            await this.useService.update(customer);

            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async verifyOtp(context: VerifyEmailDto) {
        try {
            return true;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async register(context: RegisterAuthUserDTO): Promise<CustomerEntity> {
        try {
            const validate = await this.validateInfoUser({
                email: context.email,
                districtCode: context.district_code,
                wardCode: context.ward_code,
                phone: context.phone,
                provinceCode: context.province_code,
            });

            if (validate.validateFormInfo.length) {
                throw new ValidateRequestException(validate.validateFormInfo);
            }

            const _convertSlug = await this.convertString.convertStringToSlug({
                text: `${context.last_name} ${context.first_name}`,
                slugConvert: ' ',
            });
            const encryptPassword = await this.encryptService.generatorPassword(context.password?.trim());

            const customerInfo = new CustomerInfoEntity();
            customerInfo.lastName = context?.last_name?.trim();
            customerInfo.firstName = context?.first_name?.trim();
            customerInfo.slug = _convertSlug;
            customerInfo.address = context?.address?.trim() || null;
            customerInfo.provinceCode = context?.province_code;
            customerInfo.districtCode = context?.district_code;
            customerInfo.wardCode = context?.ward_code;
            customerInfo.typeDocs = context.type_docs;
            customerInfo.valueTypeDocs = context?.value_type_docs?.trim();
            customerInfo.point = 0;
            customerInfo.street = context.street?.trim() || null;
            customerInfo.note = null;

            if (validate.province !== null) {
                customerInfo.province = validate.province;
            }

            if (validate.district !== null) {
                customerInfo.district = validate.district;
            }

            if (validate.ward !== null) {
                customerInfo.ward = validate.ward;
            }

            const customer = new CustomerEntity();
            customer.email = context?.email?.trim();
            customer.password = encryptPassword;
            customer.phone = context?.phone?.trim();
            customer.token = '';
            customer.refreshToken = '';
            customer.isVerify = EIsVerify.UN_ACTIVE;
            customer.status = EStatusNumber.ACTIVE;
            customer.customerInfo = customerInfo;

            const customerInsert = await this.useService.insert(customer);

            return customerInsert;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    private async validateInfoUser(validateForm: TypeValidateInfoUser): Promise<TypeResultValidateInfoUser> {
        const validateFormInfo: TypeValidateField[] = [];

        const [existEmail, existPhone] = await this.useService.validateExistInfo(
            validateForm.email,
            validateForm.phone,
        );

        const [provinceResult, districtResult, wardResult] = await Promise.all([
            this.provinceService.findOne(validateForm.provinceCode),
            this.districtService.findOne(validateForm.districtCode),
            this.wardService.findOne(validateForm.wardCode),
        ]);

        existEmail !== null &&
            validateFormInfo.push(this.validateFieldService.get(EnumValidateField.INVALID_EXIST_EMAIL_USER, 'email'));

        existPhone !== null &&
            validateFormInfo.push(this.validateFieldService.get(EnumValidateField.INVALID_EXIST_PHONE_USER, 'phone'));

        provinceResult === null &&
            validateFormInfo.push(this.validateFieldService.get(EnumValidateField.NOT_EXIST_PROVINCE, 'province_code'));

        districtResult === null &&
            validateFormInfo.push(this.validateFieldService.get(EnumValidateField.NOT_EXIST_DISTRICT, 'district_code'));

        wardResult === null &&
            validateFormInfo.push(this.validateFieldService.get(EnumValidateField.NOT_EXIST_WARD, 'ward_code'));

        return {
            existEmail: existEmail,
            existPhone: existPhone,
            province: provinceResult,
            district: districtResult,
            ward: wardResult,
            validateFormInfo: validateFormInfo,
        };
    }
}
