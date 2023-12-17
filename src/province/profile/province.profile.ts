import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { ProvinceEntity } from 'src/province/entities/province.entity';
import { ProvinceViewAll } from '../view/province.view';

export class ProvinceProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly _mapper: Mapper) {
        super(_mapper);
    }

    get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, ProvinceEntity, ProvinceViewAll);
        };
    }
}
