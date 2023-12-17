import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { WardRepository } from './ward.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardEntity } from './entities/ward.entity';
import { WardProfile } from './profile/ward.profile';

@Module({
    imports: [TypeOrmModule.forFeature([WardEntity])],
    controllers: [WardController],
    providers: [WardService, WardRepository, WardProfile],
    exports: [WardService, WardRepository],
})
export class WardModule {}
