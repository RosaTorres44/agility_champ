import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(userId: number, roleId: number): Promise<{
        topStats: {
            name: string;
            value: string;
            icon: string;
            color: string;
        }[];
        recentCompetitions: {
            id: number;
            nombre: string;
            status: string;
            statusColor: string;
            progress: number;
        }[];
        recentActivity: {
            type: string;
            title: string;
            subtitle: string;
            meta: string;
            metaColor: string;
        }[];
    }>;
}
