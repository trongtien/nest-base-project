import { BadGatewayException, Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ExceptionCustom } from 'src/shared/exception/custom.exception';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth-user/guard/auth-user-jwt-access-token.guard';
import { CurrentUser } from '../auth-user/decorator/auth-get-user.decorator';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CustomerEntity } from './entities/customer.entity';
import { UserView } from './view/user.view';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ChangePasswordDto } from './dto/update-password.dto';
import { AuthPayloadJwtView } from '../shared/baseHttp.view';

@Controller('customer')
@ApiTags('Customer')
export class UserController {
    constructor(@InjectMapper() private readonly automapper: Mapper, private readonly userService: UserService) {}

    @Get('/')
    @UseGuards(JwtAccessTokenGuard)
    async getInfoByToken(@CurrentUser() currentUser: AuthPayloadJwtView) {
        try {
            const customer = await this.userService.findOne(currentUser.id);

            if (customer === null) {
                throw new BadGatewayException('Customer not fount');
            }

            const mappingInfoView = await this.automapper.map(customer, CustomerEntity, UserView);
            return mappingInfoView;
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('/change-password')
    @UseGuards(JwtAccessTokenGuard)
    async changePassword(@CurrentUser() currentUser: AuthPayloadJwtView, @Body() changePasswordDto: ChangePasswordDto) {
        try {
            return await this.userService.updatePassword(currentUser, changePasswordDto);
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    @Post('/register-device')
    @UseGuards(JwtAccessTokenGuard)
    async registerDevice(@CurrentUser() currentUser: AuthPayloadJwtView, @Body() registerDeviceDto: RegisterDeviceDto) {
        try {
            return await this.userService.updateDevice(currentUser, registerDeviceDto);
        } catch (error) {
            throw new ExceptionCustom(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
