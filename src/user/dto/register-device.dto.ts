import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDeviceDto {
    @ApiProperty({
        name: 'token_fcm',
        description: 'Token fire base',
        required: true,
        type: String,
        example: '',
    })
    @IsString()
    @IsNotEmpty()
    public token_fcm: string;

    @ApiProperty({
        name: 'device_id',
        description: 'device connect',
        required: true,
        type: String,
        example: '',
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public device_id: string;
}
