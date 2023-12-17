import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { UserOptionView } from '../../user/view/user-option.view';

export class AuthRegisterView {
    @AutoMap()
    @Expose()
    public id: string | null;

    @AutoMap()
    @Expose({ name: 'last_name' })
    public lastName: string | null;

    @AutoMap()
    @Expose({ name: 'first_name' })
    public firstName: string | null;

    @AutoMap()
    @Expose({ name: 'full_name' })
    public fullName: string | null;

    @AutoMap()
    @Expose({ name: 'phone' })
    public phone: string | null;

    @AutoMap()
    @Expose({ name: 'address' })
    public address: string | null;

    @AutoMap()
    @Expose({ name: 'street' })
    public street: string | null;

    @AutoMap()
    @Expose({ name: 'type_docs' })
    public typeDocs: number | null;

    @AutoMap()
    @Expose({ name: 'type_docs_name' })
    public typeDocsName: string | null;

    @AutoMap()
    @Expose({ name: 'value_type_docs' })
    public valueTypeDocs: string | null;

    @AutoMap()
    @Expose({ name: 'email' })
    public email: string | null;

    // @AutoMap()
    // @Expose()
    // public count_warning_approve: number | null;

    // @AutoMap()
    // @Expose()
    // public count_warning_un_verified: number | null;

    @AutoMap()
    @Expose({ name: 'token' })
    public token: string | null;

    @AutoMap()
    @Expose({ name: 'refresh_token' })
    public refreshToken: string | null;

    @AutoMap()
    @Expose({ name: 'token_fcm' })
    public tokenFcm: string | null;

    @AutoMap()
    @Expose({ name: 'device_id ' })
    public deviceId: string | null;

    @AutoMap({ type: () => UserOptionView })
    @Expose({ name: 'province' })
    public province: UserOptionView | null;

    @AutoMap({ type: () => UserOptionView })
    @Expose({ name: 'district' })
    public district: UserOptionView | null;

    @AutoMap({ type: () => UserOptionView })
    @Expose({ name: 'ward' })
    public ward: UserOptionView | null;
}
