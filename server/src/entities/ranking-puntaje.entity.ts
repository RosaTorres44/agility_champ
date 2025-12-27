import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ResultadoPista } from './resultado-pista.entity';
import { Dupla } from './dupla.entity';

@Entity('ranking_puntaje')
export class RankingPuntaje {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'int', default: 2024 })
    anio: number;

    @Column({ type: 'bigint' })
    id_resultado_pista: number;

    @ManyToOne(() => ResultadoPista)
    @JoinColumn({ name: 'id_resultado_pista' })
    resultadoPista: ResultadoPista;

    @Column({ type: 'bigint' })
    id_dupla: number;

    @ManyToOne(() => Dupla)
    @JoinColumn({ name: 'id_dupla' })
    dupla: Dupla;

    @Column()
    puntos: number;

    @Column({ nullable: true })
    motivo: string;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
