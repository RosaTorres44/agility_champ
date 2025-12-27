import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pista } from './pista.entity';
import { Dupla } from './dupla.entity';

@Entity('inscripcion')
export class Inscripcion {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    id_pista: number;

    @ManyToOne(() => Pista)
    @JoinColumn({ name: 'id_pista' })
    pista: Pista;

    @Column({ type: 'bigint' })
    id_dupla: number;

    @ManyToOne(() => Dupla)
    @JoinColumn({ name: 'id_dupla' })
    dupla: Dupla;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
