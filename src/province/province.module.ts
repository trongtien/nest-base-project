import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './entities/province.entity';
import { ProvinceRepository } from './province.repository';
import { ProvinceProfile } from './profile/province.profile';
import { RedisService } from 'src/shared/redis/redis.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProvinceEntity])],
    controllers: [ProvinceController],
    providers: [ProvinceService, ProvinceRepository, ProvinceProfile, RedisService],
    exports: [ProvinceRepository, ProvinceService],
})
export class ProvinceModule {}
