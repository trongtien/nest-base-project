import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionCustom extends HttpException {
    constructor(httpStatus: HttpStatus, error: any) {
        let status = httpStatus;

        if (error?.status) {
            status = error.status;
        }

        if (status === HttpStatus.BAD_REQUEST && error.options?.cause) {
            error = error.options?.cause;
        }

        super(error, status, { cause: error, description: error });
    }
}
