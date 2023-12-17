import { Injectable } from '@nestjs/common';

import { validateFieldMessage } from './validate-field.message';
import { TypeValidateField } from './validate-field.type';
import { EnumValidateField } from './validate-field.enum';

@Injectable()
export class ValidateFieldService {
    get(code: EnumValidateField, field: string): TypeValidateField {
        return {
            field: field,
            code: code,
            message: validateFieldMessage?.[code] ?? '',
        };
    }

    public async isCompareConfirmPassword(password: string, passwordConfirm: string): Promise<boolean> {
        return password === passwordConfirm;
    }
}
