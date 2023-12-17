import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        name: 'current_password',
        description: 'Password user current',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    public current_password: string;

    @ApiProperty({
        name: 'password',
        description: 'password change new',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    public password: string;

    @ApiProperty({
        name: 'confirm_password',
        description: 'password change new confirm',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    public confirm_password: string;
}
