import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class RegisterAdminDto {
    @ApiProperty({
        name: 'username',
        description: 'username',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public username: string;

    @ApiProperty({
        name: 'password',
        description: 'password',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public password: string;

    @ApiProperty({
        name: 'status',
        description: 'status',
        required: true,
        type: Number,
        example: '',
    })
    @IsNumber()
    @IsNotEmpty()
    public status: number;
}
