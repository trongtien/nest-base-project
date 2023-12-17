import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: './../../.env.development' });

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '27.74.255.229',
    port: 3400,
    password: '111',
    username: 'postgres',
    database: 'bds_pg_dev',
    schema: 'bds_user',
    synchronize: false,
    logging: true,
    retryDelay: 500,
    retryAttempts: 3,
    entities: [__dirname + '/../**/**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../src/migration/**/*.ts'],
    subscribers: [__dirname + '/../src/subscriber/**/*.ts'],
};
// export const typeOrmConfig: TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: process.env[Configuration.HOST_POSTGRES],
//     port: process.env[Configuration.PORT_POSTGRES] ? parseInt(process.env[Configuration.PORT_POSTGRES]) : undefined,
//     password: process.env[Configuration.PASSWORD_POSTGRES],
//     username: process.env[Configuration.USER_POSTGRES],
//     database: process.env[Configuration.DATABASE_POSTGRES],
//     schema: process.env[Configuration.SCHEMA_POSTGRES],
//     synchronize: parseInt(process.env[Configuration.SYNCHRONIZE_POSTGRES]) === 0 ? false : true,
//     logging: true,
//     retryDelay: 500,
//     retryAttempts: 3,
//     entities: [__dirname + '/../**/*.entity.{js,ts}'],
//     migrations: [__dirname + '/../src/migration/**/*.ts'],
//     subscribers: [__dirname + '/../src/subscriber/**/*.ts'],
// };

export const connectionSource = new DataSource(typeOrmConfig as DataSourceOptions);
