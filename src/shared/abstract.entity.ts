import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
    @AutoMap()
    @Expose()
    @Column({ name: 'created_by', nullable: true, default: 'system', length: 255 })
    createdBy?: string;

    @AutoMap()
    @Expose()
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt?: Date;

    @AutoMap()
    @Expose()
    @UpdateDateColumn({ name: 'modify_at', nullable: true, type: 'timestamp' })
    modifyAt?: Date;

    @AutoMap()
    @Expose()
    @Column({ name: 'modify_by', nullable: true, default: 'system', length: 255 })
    modifyBy?: string;
}
