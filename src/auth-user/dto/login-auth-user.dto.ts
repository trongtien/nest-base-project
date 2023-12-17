import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthUserDTO {
    @ApiProperty({
        name: 'username',
        description: 'Email or phone verify authentication',
        required: true,
        type: String,
        example: '0707525136',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public username: string;

    @ApiProperty({
        name: 'password',
        description: 'Password user verify authentication',
        required: true,
        type: String,
        example: 'root123',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public password: string;
}
