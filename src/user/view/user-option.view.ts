import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export class UserOptionView {
    @AutoMap()
    @Expose()
    name: string | null;

    @AutoMap()
    @Expose()
    code: number | null;

    @AutoMap()
    @Expose()
    lat: number | null;

    @AutoMap()
    @Expose()
    lang: number | null;
}
