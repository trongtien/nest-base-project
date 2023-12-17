import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToNumberPipe implements PipeTransform {
    transform(value: any, { type, metatype }: ArgumentMetadata) {
        if (type === 'query' && metatype === Number) {
            return value ? parseInt(value) : undefined;
        }

        return value;
    }
}
