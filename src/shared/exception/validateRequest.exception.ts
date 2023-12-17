import { HttpException, HttpStatus } from '@nestjs/common';
import AppConstants from '../constants/app.constants';

export class ValidateRequestException extends HttpException {
    constructor(error: any) {
        super(AppConstants.MESSAGE_BAD_REQUEST, HttpStatus.BAD_REQUEST, { cause: error, description: error });
    }
}
