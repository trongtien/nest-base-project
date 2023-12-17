import { ValidationError } from '@nestjs/common';
import { ValidateRequestException } from '../exception/validateRequest.exception';

export const validationTranForm = (errors: ValidationError[]) => {
    const result = errors.map((error) => ({
        code: '',
        field: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
    }));
    return new ValidateRequestException(result);
};
