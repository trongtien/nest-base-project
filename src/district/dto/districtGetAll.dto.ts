import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DistrictGetAllDto {
    @ApiProperty({
        description: 'Search district by province',
        required: true,
        type: Number,
    })
    @IsNumber()
    @Type(() => Number)
    public province_code?: number;

    @ApiProperty({
        description: 'Search paging item, page undefined get all page item',
        required: false,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    public page?: number;

    @ApiProperty({
        description: 'Search limit item, limit undefined get all total item',
        required: false,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    public limit?: number;

    @ApiProperty({
        description: 'Search name item',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    public name?: string;

    @ApiProperty({
        description: 'Search multiple code',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    public code?: string;
}
