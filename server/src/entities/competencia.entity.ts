import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organizacion } from './organizacion.entity';
import { Persona } from './persona.entity';

@Entity('competencia')
export class Competencia {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'date' })
    fecha_inicio: Date;

    @Column({ type: 'tinyint', default: 1 })
    flg_homologada: number;

    @Column({ nullable: true })
    numero: number;

    @Column({ nullable: true })
    anio: number;

    @Column({ type: 'bigint', nullable: true })
    id_organizacion: number;

    @ManyToOne(() => Organizacion)
    @JoinColumn({ name: 'id_organizacion' })
    organizacion: Organizacion;

    @Column({ type: 'bigint', nullable: true })
    id_juez: number;

    @ManyToOne(() => Persona)
    @JoinColumn({ name: 'id_juez' })
    juez: Persona;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
