import { Mapper, MappingProfile, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { AuthAdminLoginView } from '../view/auth-admin-login.view';
import { AdminEntity } from '../../admin/entities/admin.entity';

export class AuthAdminLoginProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, AdminEntity, AuthAdminLoginView);
        };
    }
}
