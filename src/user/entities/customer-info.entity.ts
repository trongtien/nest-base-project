'use strict';
import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { DistrictEntity } from 'src/district/entities/district.entity';
import { ProvinceEntity } from 'src/province/entities/province.entity';
import { AbstractEntity } from 'src/shared/abstract.entity';
import { WardEntity } from 'src/ward/entities/ward.entity';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customer_info' })
@Index(['id'])
@Index(['provinceCode', 'districtCode', 'wardCode'])
export class CustomerInfoEntity extends AbstractEntity {
    @Expose()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'last_name', nullable: false, length: 100 })
    lastName: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'first_name', nullable: false, length: 100 })
    firstName: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'slug', type: 'varchar', length: 255, nullable: false })
    slug?: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'address', length: 255, nullable: true, default: null })
    address: string | null;

    @Expose()
    @AutoMap()
    @Column({ name: 'street', length: 255, nullable: true, default: null })
    street: string | null;

    @Column({ name: 'province_code', type: 'int', nullable: false })
    provinceCode: number;

    @Column({ name: 'district_code', type: 'int', nullable: false })
    districtCode: number;

    @Column({ name: 'ward_code', type: 'int', nullable: false })
    wardCode: number;

    @Expose()
    @AutoMap()
    @Column({ name: 'type_docs', type: 'integer', nullable: false })
    typeDocs: number;

    @Expose()
    @AutoMap()
    @Column({ name: 'value_type_docs', type: 'varchar', nullable: false })
    valueTypeDocs: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'image_id', default: null, nullable: true })
    imageId: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'point', default: 0, type: 'integer', nullable: false })
    point: number;

    @Expose()
    @AutoMap()
    @Column({ name: 'note', default: null, nullable: true, length: 255 })
    note: string | null;

    @Expose()
    @AutoMap()
    @OneToOne(() => ProvinceEntity, (province) => province.code, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'province_code' })
    province: ProvinceEntity;

    @Expose()
    @AutoMap()
    @OneToOne(() => DistrictEntity, (district) => district.code, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'district_code' })
    district: DistrictEntity;

    @Expose()
    @AutoMap()
    @OneToOne(() => WardEntity, (ward) => ward.code, { cascade: true, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ward_code' })
    ward: WardEntity;
}
