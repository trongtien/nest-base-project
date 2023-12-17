import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthAdminDTO {
    @ApiProperty({
        name: 'username',
        description: 'Username verify authentication',
        required: true,
        type: String,
        example: 'root',
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
        example: 'root123@',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public password: string;
}
