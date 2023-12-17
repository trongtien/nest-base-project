import { Inject, Injectable } from '@nestjs/common';
import AppConstants from '../constants/app.constants';
import { Redis } from 'ioredis';
import { isObject } from 'lodash';

@Injectable()
export class RedisService {
    public constructor(@Inject(AppConstants.PROVIDER_REDIS_CLIENT) private readonly client: Redis) {}

    keyCache(keyDefault: string, object?: any): string {
        let cacheKey: string = keyDefault;

        if (!object || !isObject(object)) {
            return cacheKey;
        }

        for (const index in object) {
            if (!object[index]) {
                continue;
            }
            cacheKey += `_${object[index]}`;
        }

        return cacheKey;
    }

    async set(key: string, value: string, expirationSeconds?: number) {
        if (expirationSeconds) {
            await this.client.set(key, value, 'EX', expirationSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async delete(key: string) {
        return await this.client.del(key);
    }
}
