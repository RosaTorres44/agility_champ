import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Competencia } from './competencia.entity';
import { Organizacion } from './organizacion.entity';

@Entity('competencia_organizacion')
export class CompetenciaOrganizacion {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    id_competencia: number;

    @ManyToOne(() => Competencia)
    @JoinColumn({ name: 'id_competencia' })
    competencia: Competencia;

    @Column({ type: 'bigint' })
    id_organizacion: number;

    @ManyToOne(() => Organizacion)
    @JoinColumn({ name: 'id_organizacion' })
    organizacion: Organizacion;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
