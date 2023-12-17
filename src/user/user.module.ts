import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerInfoEntity } from './entities/customer-info.entity';
import { UserRepository } from './user.repository';
import { UserProfile } from './profile/user.profile';

@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity, CustomerInfoEntity])],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserProfile],
    exports: [UserRepository, UserService],
})
export class UserModule {}
