import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { DistrictView } from '../view/district.view';
import { DistrictEntity } from '../entities/district.entity';

export class DistrictProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, DistrictEntity, DistrictView);
        };
    }
}
