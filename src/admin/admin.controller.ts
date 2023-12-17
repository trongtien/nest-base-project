import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { ExceptionCustom } from '../shared/exception/custom.exception';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
    constructor(private readonly adminService: AdminService, @InjectMapper() private readonly automapper: Mapper) {}

    @Post('/register')
    async register(@Body() registerDto: RegisterAdminDto): Promise<boolean> {
        try {
            const result = await this.adminService.create(registerDto);
            return result;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
