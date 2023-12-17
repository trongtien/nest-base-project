import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../shared/abstract.entity';
import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

@Entity({ name: 'admins' })
@Index(['id'], { unique: true })
@Index(['username'], { unique: true })
export class AdminEntity extends AbstractEntity {
    @Expose()
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @AutoMap()
    @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
    username: string;

    @Expose()
    @AutoMap()
    @Column({ type: 'text', nullable: false })
    password: string;

    @Expose()
    @AutoMap()
    @Column({ type: 'text', nullable: true })
    token: string | null;

    @Expose()
    @AutoMap()
    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    refreshToken: string | null;

    @Expose()
    @AutoMap()
    @Column({ name: 'token_fcm', type: 'text', nullable: true, default: null })
    tokenFcm: string | null;

    @Expose()
    @AutoMap()
    @Column({ name: 'device_id', type: 'text', nullable: true, default: null })
    deviceId: string | null;

    @Expose()
    @AutoMap()
    @Column({ name: 'status', default: 1, type: 'integer', nullable: false })
    status: number;
}
