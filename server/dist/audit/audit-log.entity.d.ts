export declare class AuditLog {
    id: number;
    user_id: number;
    user_name: string;
    action: string;
    entity: string;
    entity_id: number;
    details: string;
    timestamp: Date;
}
