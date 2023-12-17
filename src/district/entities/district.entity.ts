import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { ProvinceEntity } from 'src/province/entities/province.entity';
import { AbstractEntity } from 'src/shared/abstract.entity';
import { CustomerInfoEntity } from 'src/user/entities/customer-info.entity';
import { WardEntity } from 'src/ward/entities/ward.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'district' })
@Index(['name', 'slug'], { unique: true })
@Index(['provinceCode'], { unique: false })
export class DistrictEntity extends AbstractEntity {
    @Column({ name: 'id', nullable: true })
    @AutoMap()
    @Expose()
    id: string;

    @PrimaryColumn({ type: 'int' })
    @AutoMap()
    @Expose()
    code: number;

    @Column({ name: 'name', length: 255, nullable: false })
    @AutoMap()
    @Expose()
    name: string;

    @Column({ name: 'type', length: 255, nullable: false })
    @AutoMap()
    @Expose()
    type: string;

    @Column({ name: 'slug', type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    @Expose()
    slug?: string;

    @Column({ name: 'lat', type: 'float', nullable: true, default: 0 })
    @AutoMap()
    @Expose()
    lat: number;

    @Column({ name: 'lang', type: 'float', nullable: true, default: 0 })
    @AutoMap()
    @Expose()
    lang: number;

    @Column({ name: 'province_code', type: 'int', nullable: false })
    @AutoMap()
    @Expose()
    provinceCode: number;

    @ManyToOne(() => ProvinceEntity, (province) => province.code)
    provinces: ProvinceEntity;

    @OneToMany(() => WardEntity, (ward) => ward.districtCode)
    wards: WardEntity[];

    @OneToMany(() => CustomerInfoEntity, (customerInfo) => customerInfo.provinceCode)
    customerInfos: CustomerInfoEntity[];
}
