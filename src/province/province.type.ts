import { ProvinceEntity } from './entities/province.entity';

export type TypeQueryAllProvince = {
    page?: number;
    limit?: number;
    name?: string;
    code?: number[];
};

export type TypeResultQueryAllProvince = {
    items: ProvinceEntity[];
    limit: number;
    page: number;
    totalItemCount: number;
};
