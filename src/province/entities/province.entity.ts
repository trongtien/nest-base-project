import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { DistrictEntity } from 'src/district/entities/district.entity';
import { AbstractEntity } from 'src/shared/abstract.entity';
import { CustomerInfoEntity } from 'src/user/entities/customer-info.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'province' })
@Index(['name', 'slug'], { unique: true })
export class ProvinceEntity extends AbstractEntity {
    @Column({ name: 'id', nullable: true })
    id: string;

    @Expose()
    @AutoMap()
    @PrimaryColumn({ name: 'code', type: 'int', nullable: false })
    code: number;

    @Expose()
    @AutoMap()
    @Column({ name: 'name', nullable: true })
    name: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'type', nullable: true })
    type?: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'slug', type: 'varchar', length: 255, nullable: true })
    slug?: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'lat', type: 'float', nullable: true, default: 0 })
    lat: number;

    @Expose()
    @AutoMap()
    @Column({ name: 'lang', type: 'float', nullable: true, default: 0 })
    lang: number;

    @OneToMany(() => DistrictEntity, (district) => district.provinceCode)
    districts: DistrictEntity[];

    @OneToMany(() => CustomerInfoEntity, (customerInfo) => customerInfo.provinceCode)
    customerInfos: CustomerInfoEntity[];
}
