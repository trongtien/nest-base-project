import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ETypeDocs } from 'src/user/user.type';

export class RegisterAuthUserDTO {
    @ApiProperty({
        name: 'last_name',
        description: 'Last name user',
        required: true,
        type: String,
        example: 'nguyen van',
    })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public readonly last_name: string;

    @ApiProperty({ name: 'first_name', description: 'First name user', required: true, type: String, example: 'Anh' })
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    public readonly first_name: string;

    @ApiProperty({ name: 'phone', description: 'Phone user', required: true, type: String, example: '0707525136' })
    @MaxLength(15)
    @IsString()
    @IsNotEmpty()
    public readonly phone: string;

    @ApiProperty({
        name: 'address',
        description: 'Address user',
        required: true,
        type: String,
        example: '292/12/2 pham hung',
    })
    @IsString()
    @MaxLength(255)
    @IsOptional()
    public readonly address: string;

    @ApiProperty({
        name: 'province_code',
        description: 'Province user',
        required: true,
        type: Number,
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    public readonly province_code: number;

    @ApiProperty({
        name: 'district_code',
        description: 'District user',
        required: true,
        type: Number,
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    public readonly district_code: number;

    @ApiProperty({
        name: 'ward_code',
        description: 'Ward user',
        required: true,
        type: Number,
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    public readonly ward_code: number;

    @ApiProperty({
        name: 'type_docs',
        description: 'Type docs user',
        required: true,
        type: Number,
        example: 1,
    })
    @IsEnum(ETypeDocs)
    @IsNotEmpty()
    public readonly type_docs: number;

    @ApiProperty({
        name: 'value_type_docs',
        description: 'Value number type docs user',
        required: true,
        type: String,
        example: '12321321321',
    })
    @IsString()
    @IsNotEmpty()
    public readonly value_type_docs: string;

    @ApiProperty({
        name: 'email',
        description: 'Email user',
        required: true,
        type: String,
        example: 'phanletrongtien@gmail.com',
    })
    @IsEmail()
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    public readonly email: string;

    @ApiProperty({
        name: 'image_id',
        description: 'Image upload',
        required: false,
        type: String,
        example: null,
    })
    @IsString()
    @IsOptional()
    public readonly image_id: string;

    @ApiProperty({
        name: 'password',
        description: 'Password user',
        required: false,
        type: String,
        example: 'root123',
    })
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    public readonly password: string;

    @ApiProperty({
        name: 'confirm_password',
        description: 'Password confirm validate password user',
        required: false,
        type: String,
        example: 'root123',
    })
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    public readonly confirm_password: string;

    @ApiProperty({
        name: 'street',
        description: 'street user',
        required: false,
        type: String,
        example: 'street',
    })
    @IsString()
    @IsOptional()
    public readonly street: string;
}
