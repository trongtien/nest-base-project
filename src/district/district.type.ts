import { DistrictEntity } from './entities/district.entity';

export type TypeQueryAllDistrict = {
    page?: number;
    provinceCode?: number;
    limit?: number;
    name?: string;
    code?: number[];
};

export type TypeResultQueryAll = {
    items: DistrictEntity[];
    limit: number;
    page: number;
    totalItemCount: number;
};
