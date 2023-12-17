import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProvinceGetAllDto {
    @ApiProperty({
        description: 'Search paging item, page undefined get all page item',
        required: false,
        type: Number,
    })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    public page?: number;

    @ApiProperty({
        description: 'Search limit item, limit undefined get all total item',
        required: false,
        type: Number,
    })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    public limit?: number;

    @ApiProperty({
        description: 'Search name item',
        required: false,
        type: String,
    })
    @IsString()
    @IsOptional()
    public name?: string;

    @ApiProperty({
        description: 'Search multiple code',
        required: false,
        type: String,
    })
    @IsString()
    @IsOptional()
    public code?: string;
}
