import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Competencia } from './competencia.entity';
import { TipoPista } from './tipo-pista.entity';
import { Grado } from './grado.entity';
import { Persona } from './persona.entity';

@Entity('pista')
export class Pista {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    id_competencia: number;

    @ManyToOne(() => Competencia)
    @JoinColumn({ name: 'id_competencia' })
    competencia: Competencia;

    @Column({ type: 'bigint' })
    id_tipo_pista: number;

    @ManyToOne(() => TipoPista)
    @JoinColumn({ name: 'id_tipo_pista' })
    tipoPista: TipoPista;

    @Column({ type: 'bigint' })
    id_grado_base: number;

    @ManyToOne(() => Grado)
    @JoinColumn({ name: 'id_grado_base' })
    gradoBase: Grado;

    @Column({ type: 'bigint', nullable: true })
    id_juez_persona: number;

    @ManyToOne(() => Persona)
    @JoinColumn({ name: 'id_juez_persona' })
    juez: Persona;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    longitud_m: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    velocidad_elegida_ms: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    tsr_seg: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    tmr_seg: number;

    @Column({ type: 'enum', enum: ['creada', 'armada', 'en_curso', 'finalizada'], default: 'creada' })
    estado: string;

    @Column({ default: false })
    flg_perro_mas_rapido: boolean;

    @Column({ nullable: true })
    modo_tsr: string; // NT, MEJOR_TIEMPO

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    velocidad_nt_ms: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    mejor_tiempo_ref_seg: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    velocidad_calculada_ms: number;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
