import { Mapper, MappingProfile, createMap, extend, forMember, mapFrom, mapWith } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CustomerEntity } from '../entities/customer.entity';
import { UserView } from '../view/user.view';
import { ProvinceEntity } from 'src/province/entities/province.entity';
import { UserOptionView } from '../view/user-option.view';
import { DistrictEntity } from 'src/district/entities/district.entity';
import { WardEntity } from 'src/ward/entities/ward.entity';
import { ETypeDocs } from '../user.type';

export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            const provinceMapping = createMap(mapper, ProvinceEntity, UserOptionView);
            const districtMapping = createMap(mapper, DistrictEntity, UserOptionView);
            const wardMapping = createMap(mapper, WardEntity, UserOptionView);

            createMap(
                mapper,
                CustomerEntity,
                UserView,
                extend(provinceMapping),
                extend(districtMapping),
                extend(wardMapping),
                forMember(
                    (destination) => destination.firstName,
                    mapFrom((source) => source.customerInfo?.firstName ?? ''),
                ),
                forMember(
                    (destination) => destination.lastName,
                    mapFrom((source) => source.customerInfo?.lastName ?? ''),
                ),
                forMember(
                    (destination) => destination.fullName,
                    mapFrom((s) => (s.customerInfo?.firstName ?? '') + ' ' + (s.customerInfo?.lastName ?? '')),
                ),
                forMember(
                    (destination) => destination.phone,
                    mapFrom((source) => source.phone),
                ),
                forMember(
                    (destination) => destination.address,
                    mapFrom((source) => source.customerInfo.address),
                ),
                forMember(
                    (destination) => destination.street,
                    mapFrom((source) => source.customerInfo.street),
                ),
                forMember(
                    (destination) => destination.typeDocs,
                    mapFrom((source) => source.customerInfo.typeDocs),
                ),
                forMember(
                    (destination) => destination.typeDocsName,
                    mapFrom((source) => {
                        switch (source.customerInfo.typeDocs) {
                            case ETypeDocs.CCCD:
                                return 'Căn cước công dân';

                            case ETypeDocs.PASSPORT:
                                return 'Passport';
                            default:
                                return '';
                        }
                    }),
                ),
                forMember(
                    (destination) => destination.email,
                    mapFrom((source) => source.email),
                ),
                forMember(
                    (destination) => destination.token,
                    mapFrom((source) => source.token),
                ),
                forMember(
                    (destination) => destination.refreshToken,
                    mapFrom((source) => source.refreshToken),
                ),
                forMember(
                    (destination) => destination.deviceId,
                    mapFrom((source) => source.deviceId),
                ),
                forMember(
                    (destination) => destination.province,
                    mapWith(UserOptionView, ProvinceEntity, (source) => source.customerInfo.province),
                ),
                forMember(
                    (destination) => destination.district,
                    mapWith(UserOptionView, DistrictEntity, (source) => source.customerInfo.district),
                ),
                forMember(
                    (destination) => destination.ward,
                    mapWith(UserOptionView, WardEntity, (source) => source.customerInfo.ward),
                ),
            );
        };
    }
}
