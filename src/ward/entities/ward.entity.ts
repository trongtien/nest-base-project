import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { DistrictEntity } from 'src/district/entities/district.entity';
import { AbstractEntity } from 'src/shared/abstract.entity';
import { CustomerInfoEntity } from 'src/user/entities/customer-info.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ward' })
@Index(['name', 'slug'], { unique: true })
@Index(['districtCode'], { unique: false })
export class WardEntity extends AbstractEntity {
    @Expose()
    @AutoMap()
    @Column({ name: 'id', nullable: true })
    id: string;

    @Expose()
    @AutoMap()
    @PrimaryColumn({ type: 'int' })
    code: number;

    @Column({ name: 'name', length: 255 })
    @Expose()
    @AutoMap()
    name: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'type', length: 255, nullable: true })
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

    @Column({ name: 'district_code', type: 'int', nullable: false })
    districtCode: number;

    @ManyToOne(() => DistrictEntity, (district) => district.code)
    districts: DistrictEntity;

    @OneToMany(() => CustomerInfoEntity, (customerInfo) => customerInfo.wardCode)
    customerInfos: CustomerInfoEntity[];
}
