import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export class AuthAdminLoginView {
    @Expose()
    @AutoMap()
    id: string;

    @Expose()
    @AutoMap()
    username: string;

    @Expose()
    @AutoMap()
    password: string;

    @Expose()
    @AutoMap()
    token: string | null;

    @Expose({ name: 'refresh_token' })
    @AutoMap()
    refreshToken: string | null;

    @Expose()
    @AutoMap()
    tokenFcm: string | null;

    @Expose()
    @AutoMap()
    deviceId: string | null;

    @Expose()
    @AutoMap()
    status: number;
}
