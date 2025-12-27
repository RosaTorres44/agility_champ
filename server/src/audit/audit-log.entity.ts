import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_log')
export class AuditLog {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', nullable: true })
    user_id: number;

    @Column()
    user_name: string; // Store name snapshot for easier reading

    @Column()
    action: string; // CREATE, UPDATE, DEACTIVATE, REACTIVATE

    @Column()
    entity: string; // persona, perro, etc.

    @Column({ type: 'bigint' })
    entity_id: number;

    @Column({ type: 'text', nullable: true })
    details: string; // JSON string of changes

    @CreateDateColumn()
    timestamp: Date;
}
