import { EnumValidateField } from './validate-field.enum';

export const validateFieldMessage: Record<string, string> = {
    [EnumValidateField.INVALID_NOT_MATCH_PASSWORD]: 'Confirm password do not match password',
    [EnumValidateField.INVALID_EXIST_EMAIL_USER]: 'Email invalid',
    [EnumValidateField.INVALID_EXIST_PHONE_USER]: 'Phone invalid',
    [EnumValidateField.NOT_EXIST_PROVINCE]: 'Province not exist',
    [EnumValidateField.NOT_EXIST_DISTRICT]: 'District not exist',
    [EnumValidateField.NOT_EXIST_WARD]: 'Ward not exist',
    [EnumValidateField.INVALID_CURRENT_CONFIRM_PASSWORD]: 'Confirm password no coincidence password',
    [EnumValidateField.INVALID_CURRENT_PASSWORD]: 'Current password invalid',
    [EnumValidateField.INVALID_EXIST_EMAIL_USERNAME_ADMIN]: 'Username invalid exist',
};
