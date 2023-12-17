import { DistrictEntity } from 'src/district/entities/district.entity';
import { ProvinceEntity } from 'src/province/entities/province.entity';
import { TypeValidateField } from 'src/shared/validateField/validate-field.type';
import { CustomerEntity } from 'src/user/entities/customer.entity';
import { WardEntity } from 'src/ward/entities/ward.entity';

export type TypeValidateInfoUser = {
    email: string;
    phone: string;
    provinceCode: number;
    districtCode: number;
    wardCode: number;
};

export type TypeResultValidateInfoUser = {
    existEmail: CustomerEntity;
    existPhone: CustomerEntity;
    province: ProvinceEntity;
    district: DistrictEntity;
    ward: WardEntity;
    validateFormInfo: TypeValidateField[];
};
