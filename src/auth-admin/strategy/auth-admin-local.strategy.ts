import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BadRequestCustom } from '../../shared/exception/badRequest.exception';
import AppConstants from '../../shared/constants/app.constants';
import { AuthAdminService } from '../auth-admin.service';

@Injectable()
export class LocalAuthAdminStrategy extends PassportStrategy(Strategy, 'local-admin') {
    constructor(private readonly authAdminService: AuthAdminService) {
        super({ usernameField: 'username', passwordField: 'password' });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authAdminService.validateUser(username.trim(), password?.trim());

        if (!user || user === null) {
            throw new BadRequestCustom(AppConstants.MESSAGE_CUSTOMER_AUTH_INVALID);
        }
        return user;
    }
}
