import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { DistrictProfile } from './profile/district.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictEntity } from './entities/district.entity';
import { DistrictRepository } from './district.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DistrictEntity])],
    controllers: [DistrictController],
    providers: [DistrictService, DistrictRepository, DistrictProfile],
    exports: [DistrictService, DistrictRepository],
})
export class DistrictModule {}
