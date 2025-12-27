import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Perro } from './perro.entity';
import { Persona } from './persona.entity';

@Entity('dupla')
export class Dupla {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    id_perro: number;

    @ManyToOne(() => Perro)
    @JoinColumn({ name: 'id_perro' })
    perro: Perro;

    @Column({ type: 'bigint' })
    id_guia_persona: number;

    @ManyToOne(() => Persona)
    @JoinColumn({ name: 'id_guia_persona' })
    guia: Persona;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
