import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import BaseHttView from '../baseHttp.view';
import AppConstants from '../constants/app.constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(error: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const status = error.getStatus();

        const appViewResponse = new BaseHttView();
        appViewResponse.http_status = status;

        switch (status) {
            case HttpStatus.INTERNAL_SERVER_ERROR:
                appViewResponse.data = null;
                appViewResponse.message = AppConstants.MESSAGE_SEVER_ERROR;
                appViewResponse.error = error?.stack || [];
                break;

            case HttpStatus.BAD_REQUEST:
                let message = error?.response ? error?.response : AppConstants.MESSAGE_BAD_REQUEST;
                const errorValidate = error?.cause ?? [];

                // Check error is validate field
                // return message Bad Request
                if (errorValidate?.length > 0 && typeof errorValidate !== 'string') {
                    message = AppConstants.MESSAGE_BAD_REQUEST;
                }

                appViewResponse.message = message;
                appViewResponse.error = error?.cause ?? [];
                break;

            case HttpStatus.NOT_FOUND:
                appViewResponse.message = AppConstants.MESSAGE_SEVER_NOT_FOUND;
                break;

            default:
                appViewResponse.message = AppConstants.MESSAGE_BAD_FORBIDDEN;
                appViewResponse.data = null;
                break;
        }

        res.status(HttpStatus.OK).json(appViewResponse);
    }
}
