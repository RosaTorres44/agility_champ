import { MaintenanceService } from './maintenance.service';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    findAll(entity: string): Promise<any>;
    create(entity: string, body: any, req: any): Promise<any>;
    update(entity: string, id: number, body: any, req: any): Promise<any>;
    deactivate(entity: string, id: number, req: any): Promise<{
        success: boolean;
    }>;
    reactivate(entity: string, id: number, req: any): Promise<{
        success: boolean;
    }>;
}
