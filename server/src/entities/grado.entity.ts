import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('grado')
export class Grado {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ unique: true })
    cod: string;

    @Column()
    nombre: string;

    @Column()
    orden: number;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
