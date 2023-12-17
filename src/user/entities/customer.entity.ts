import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { AbstractEntity } from 'src/shared/abstract.entity';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerInfoEntity } from './customer-info.entity';

@Entity({ name: 'customers' })
@Index(['id'], { unique: true })
@Index(['phone', 'email'], { unique: true })
export class CustomerEntity extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    @AutoMap()
    @Expose()
    id: string;

    @Column({ type: 'text', nullable: false })
    @AutoMap()
    password: string;

    @Column({ name: 'email', type: 'varchar', length: 50, nullable: false })
    @AutoMap()
    @Expose()
    email: string;

    @Column({ name: 'phone', type: 'varchar', length: 15, nullable: false })
    @AutoMap()
    @Expose()
    phone: string;

    @Column({ type: 'text', nullable: true })
    @AutoMap()
    @Expose()
    token: string | null;

    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    @AutoMap()
    @Expose()
    refreshToken: string | null;

    @Column({ name: 'is_verify', type: 'int', nullable: true, default: 0 })
    @AutoMap()
    @Expose()
    isVerify!: number;

    @Column({ name: 'status', default: 1, type: 'integer', nullable: false })
    @AutoMap()
    @Expose()
    status: number;

    @Column({ name: 'token_fcm', type: 'text', nullable: true, default: null })
    @AutoMap()
    @Expose()
    tokenFcm: string | null;

    @Column({ name: 'device_id', type: 'text', nullable: true, default: null })
    @AutoMap()
    @Expose()
    deviceId: string | null;

    @Column({ name: 'customer_info_id', type: 'varchar', nullable: true })
    customerInfoId!: string;

    @OneToOne(() => CustomerInfoEntity, (customerInfoEntity) => customerInfoEntity.id, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    @AutoMap()
    @Expose()
    @JoinColumn({ name: 'customer_info_id' })
    customerInfo?: CustomerInfoEntity;
}
