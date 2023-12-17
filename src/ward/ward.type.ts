import { WardEntity } from './entities/ward.entity';

export type TypeQueryAllProvince = {
    page?: number;
    districtCode?: number;
    limit?: number;
    name?: string;
    code?: number[];
};

export type TypeResultQueryAllProvince = {
    items: WardEntity[];
    limit: number;
    page: number;
    totalItemCount: number;
};
