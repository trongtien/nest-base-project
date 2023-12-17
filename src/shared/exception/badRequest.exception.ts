import { BadRequestException } from '@nestjs/common';

export class BadRequestCustom extends BadRequestException {
    constructor(message?: string | any, error?: any) {
        super(message, error);
    }
}
