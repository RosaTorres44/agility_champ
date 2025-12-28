import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pista } from './pista.entity';
import { Dupla } from './dupla.entity';
import { Perro } from './perro.entity';
import { Inscripcion } from './inscripcion.entity';

@Entity('resultado_pista')
export class ResultadoPista {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', nullable: true })
    id_inscripcion: number;

    @ManyToOne(() => Inscripcion)
    @JoinColumn({ name: 'id_inscripcion' })
    inscripcion: Inscripcion;

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

    @Column({ type: 'bigint' })
    id_perro: number;

    @ManyToOne(() => Perro)
    @JoinColumn({ name: 'id_perro' })
    perro: Perro;

    @Column({ nullable: true })
    categoria_competitiva: string; // REGULAR, SENIOR

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    tiempo_cronometrado_seg: number;

    @Column({ default: 0 })
    faltas: number;

    @Column({ default: 0 })
    rehuses: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    penalidad_total_seg: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tiempo_total_seg: number;

    @Column({ default: false })
    es_eli: boolean;

    @Column({ default: false })
    es_ausente: boolean;

    @Column({ default: true })
    es_elegible_podio: boolean;

    @Column({ default: true })
    es_elegible_ranking: boolean;

    @Column({ nullable: true })
    puesto: number;

    @Column({ default: 0 })
    puntos_ranking: number;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
