import Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';
import { Configuration } from './configuration.enum';

export const ConfigurationValidate: ConfigModuleOptions['validationSchema'] = Joi?.object({
    [Configuration.HOST]: Joi.string().required(),
    [Configuration.PORT]: Joi.number().required(),
    [Configuration.HOST_POSTGRES]: Joi.string().required(),
    [Configuration.PORT_POSTGRES]: Joi.number().required(),
    [Configuration.USER_POSTGRES]: Joi.string().required(),
    [Configuration.PASSWORD_POSTGRES]: Joi.string().required(),
    [Configuration.DATABASE_POSTGRES]: Joi.string().required(),
    [Configuration.SCHEMA_POSTGRES]: Joi.string().required(),
    [Configuration.SYNCHRONIZE_POSTGRES]: Joi.number().required(),
    [Configuration.REDIS_CLIENT]: Joi.string().required(),
    [Configuration.REDIS_PORT]: Joi.number().required(),
    [Configuration.REDIS_USER]: Joi.string().required(),
    [Configuration.REDIS_PASSWORD]: Joi.string().required(),
    [Configuration.JWT_CUSTOMER_ACCESS_SECRET_REFRESH]: Joi.string().required(),
    [Configuration.JWT_CUSTOMER_ACCESS_SECRET]: Joi.string().required(),
    [Configuration.JWT_CUSTOMER_ACCESS_EXPIRATION_TIME]: Joi.string().required(),
    [Configuration.JWT_CUSTOMER_TYPE_SECRET_APP]: Joi.string().required(),
    [Configuration.JWT_CUSTOMER_CLIENT_HOST_APP]: Joi.string().required(),
    [Configuration.JWT_ADMIN_ACCESS_SECRET_REFRESH]: Joi.string().required(),
    [Configuration.JWT_ADMIN_ACCESS_SECRET]: Joi.string().required(),
    [Configuration.JWT_ADMIN_ACCESS_EXPIRATION_TIME]: Joi.number().required(),
    [Configuration.JWT_ADMIN_TYPE_SECRET_APP]: Joi.string().required(),
    [Configuration.JWT_ADMIN_CLIENT_HOST_APP]: Joi.string().required(),
    [Configuration.SETTING_ADMIN_SECRET_KEY]: Joi.string().required(),
});
