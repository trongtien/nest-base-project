import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseTransform } from './transform.type';
import BaseHttView from '../baseHttp.view';

export class TransformInterceptors<T> implements NestInterceptor<T, ResponseTransform<T>> {
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data) => {
                const view = new BaseHttView();
                view.data = data;

                return { data: view };
            }),
        );
    }
}
