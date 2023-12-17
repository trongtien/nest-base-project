import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenUserAuthDto {
    @ApiProperty({
        name: 'refresh_token',
        description: 'Refresh token user verify authentication',
        required: true,
        type: String,
        example: '',
    })
    @IsString()
    @IsNotEmpty()
    public readonly refresh_token: string;
}
