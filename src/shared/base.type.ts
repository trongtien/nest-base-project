import { AuthPayloadJwtView } from './baseHttp.view';

export type TypeContextPayloadToken = {
    payload: AuthPayloadJwtView;
    expiresIn: string;
    secretKey: string;
    iat: number;
    exp: number;
};

export enum EnumRolePayloadJwt {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
}
