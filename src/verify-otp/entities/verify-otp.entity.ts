import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../shared/abstract.entity';

@Entity({ name: 'verify_otp' })
@Index(['email'], { unique: false })
export class VerifyOTPEntity extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'otp', type: 'text' })
    otp: string;

    @Column({ name: 'email', type: 'character', length: 255 })
    email: string;

    @Column({ name: 'time', type: 'float', nullable: true, default: null })
    time: number;
}
