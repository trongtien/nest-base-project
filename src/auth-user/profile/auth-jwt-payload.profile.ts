import { Mapper, MappingProfile, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CustomerEntity } from '../../user/entities/customer.entity';
import { AuthPayloadJwtView } from '../../shared/baseHttp.view';
import { EnumRolePayloadJwt } from '../../shared/base.type';

export class AuthPayloadJwtProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                CustomerEntity,
                AuthPayloadJwtView,

                forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                ),
                forMember(
                    (destination) => destination.fullName,
                    mapFrom((source) => `${source.customerInfo.firstName} ${source.customerInfo.lastName}`),
                ),
                forMember(
                    (destination) => destination.phone,
                    mapFrom((source) => source.phone),
                ),
                forMember(
                    (destination) => destination.email,
                    mapFrom((source) => source.email),
                ),
                forMember(
                    (destination) => destination.point,
                    mapFrom((source) => source?.customerInfo?.point || null),
                ),
                forMember(
                    (destination) => destination.status,
                    mapFrom((source) => source.status),
                ),
                forMember(
                    (destination) => destination.role,
                    mapFrom(() => EnumRolePayloadJwt.CUSTOMER),
                ),
                forMember(
                    (destination) => destination.tokenFcm,
                    mapFrom((source) => source?.tokenFcm ?? null),
                ),
                forMember(
                    (destination) => destination.deviceId,
                    mapFrom((source) => source?.deviceId ?? null),
                ),
                forMember(
                    (destination) => destination.username,
                    mapFrom(() => null),
                ),
            );
        };
    }
}
