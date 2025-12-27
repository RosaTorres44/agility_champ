import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoPersona } from './tipo-persona.entity';

@Entity('persona')
export class Persona {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    id_tipo_persona: number;

    @ManyToOne(() => TipoPersona)
    @JoinColumn({ name: 'id_tipo_persona' })
    tipoPersona: TipoPersona;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    telefono: string;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
