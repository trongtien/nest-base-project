import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { AdminRepository } from './admin.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AdminEntity])],
    controllers: [AdminController],
    providers: [AdminService, AdminRepository],
    exports: [AdminService, AdminRepository],
})
export class AdminModule {}
