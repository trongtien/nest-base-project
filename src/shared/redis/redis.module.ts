import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import AppConstants from '../constants/app.constants';
import { RedisAsyncModuleOptions } from './redis.type';
import IORedis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
    static async registerAsync({ useFactory, imports, inject }: RedisAsyncModuleOptions): Promise<DynamicModule> {
        const logger = new Logger(RedisModule.name);

        const redisProvider = {
            provide: AppConstants.PROVIDER_REDIS_CLIENT,
            useFactory: async (...args) => {
                const connectionOptions = await useFactory(...args);

                const client = await new IORedis(connectionOptions);

                client.on('error', (err) => {
                    logger.error('Redis Client Error: ', err);
                });

                client.on('connect', () => {
                    logger.log(`Connected to redis on ${client.options.host}:${client.options.port}`);
                });

                client.on('error', function (e) {
                    logger.error(`Error connecting to redis: "${e}"`);

                    if (e.message === 'ERR invalid password') {
                        logger.error(`Fatal error occurred "${e.message}". Stopping server.`);
                    }
                });

                return client;
            },
            inject,
        };

        return {
            module: RedisModule,
            imports,
            providers: [redisProvider, RedisService],
            exports: [AppConstants.PROVIDER_REDIS_CLIENT, RedisService],
        };
    }
}
