import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
    @ApiProperty({
        name: 'otp',
        description: 'Otp verify email',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(6)
    @IsString()
    @IsNotEmpty()
    public otp: string;

    @ApiProperty({
        name: 'email',
        description: 'Email verify',
        required: true,
        type: String,
        example: '',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public email: string;
}
