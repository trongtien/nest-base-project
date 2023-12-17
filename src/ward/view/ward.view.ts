import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export class WardView {
    @AutoMap()
    @Expose()
    type: string | null;

    @AutoMap()
    @Expose()
    code: number;

    @AutoMap()
    @Expose()
    name: string;

    @AutoMap()
    @Expose()
    slug: string | null;

    @AutoMap()
    @Expose()
    lat: number | null;

    @AutoMap()
    @Expose()
    lang: number | null;
}
