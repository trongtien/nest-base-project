import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthUserService } from '../auth-user.service';
import { BadRequestCustom } from '../../shared/exception/badRequest.exception';
import AppConstants from '../../shared/constants/app.constants';

@Injectable()
export class LocalAuthUserStrategy extends PassportStrategy(Strategy, 'local-user') {
    constructor(private readonly authUserService: AuthUserService) {
        super({ usernameField: 'username', passwordField: 'password' });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authUserService.validateUser(username.trim(), password?.trim());

        if (!user || user === null) {
            throw new BadRequestCustom(AppConstants.MESSAGE_CUSTOMER_AUTH_INVALID);
        }
        return user;
    }
}
