import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { WardEntity } from '../entities/ward.entity';
import { WardView } from '../view/ward.view';

export class WardProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, WardEntity, WardView);
        };
    }
}
