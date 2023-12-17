import { Mapper, MappingProfile, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { AuthPayloadJwtView } from '../../shared/baseHttp.view';
import { EnumRolePayloadJwt } from '../../shared/base.type';
import { AdminEntity } from '../../admin/entities/admin.entity';

export class AuthAdminPayloadJwtProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                AdminEntity,
                AuthPayloadJwtView,

                forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                ),
                forMember(
                    (destination) => destination.fullName,
                    mapFrom((source) => source.username),
                ),
                forMember(
                    (destination) => destination.username,
                    mapFrom((source) => source.username),
                ),
                forMember(
                    (destination) => destination.status,
                    mapFrom((source) => source.status),
                ),
                forMember(
                    (destination) => destination.role,
                    mapFrom(() => EnumRolePayloadJwt.ADMIN),
                ),
                forMember(
                    (destination) => destination.deviceId,
                    mapFrom((source) => source.deviceId),
                ),
                forMember(
                    (destination) => destination.tokenFcm,
                    mapFrom((source) => source.tokenFcm),
                ),
                forMember(
                    (destination) => destination.point,
                    mapFrom(() => 0),
                ),
                forMember(
                    (destination) => destination.phone,
                    mapFrom(() => null),
                ),
                forMember(
                    (destination) => destination.email,
                    mapFrom(() => null),
                ),
                forMember(
                    (destination) => destination.isVerify,
                    mapFrom(() => 1),
                ),
            );
        };
    }
}
