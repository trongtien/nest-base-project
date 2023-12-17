import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export type RedisModuleOptions = RedisOptions;

export type RedisAsyncModuleOptions = {
    useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
    Pick<FactoryProvider, 'inject'>;
