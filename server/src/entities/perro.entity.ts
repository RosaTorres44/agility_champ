import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaTalla } from './categoria-talla.entity';
import { Grado } from './grado.entity';
import { Raza } from './raza.entity';

@Entity('perro')
export class Perro {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento: Date;

    @Column({ nullable: true })
    chip: string;

    @Column({ type: 'bigint' })
    id_categoria_talla: number;

    @ManyToOne(() => CategoriaTalla)
    @JoinColumn({ name: 'id_categoria_talla' })
    categoriaTalla: CategoriaTalla;

    @Column({ type: 'bigint' })
    id_grado_actual: number;

    @ManyToOne(() => Grado)
    @JoinColumn({ name: 'id_grado_actual' })
    gradoActual: Grado;

    @Column({ type: 'bigint', nullable: true })
    id_raza: number;

    @ManyToOne(() => Raza)
    @JoinColumn({ name: 'id_raza' })
    raza: Raza;

    @Column({ nullable: true })
    observaciones: string;

    @Column({ default: true })
    flg_activo: boolean;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_actualizacion: Date;
}
