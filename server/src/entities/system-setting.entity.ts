import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    key: string;

    @Column({ type: 'text' })
    value: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    flg_activo: boolean;
}
