import { ClientFeaturesService } from './client-features.service';
export declare class ClientFeaturesController {
    private readonly clientService;
    constructor(clientService: ClientFeaturesService);
    getMyDogs(req: any): Promise<{
        duplaId: number;
        raza_nombre: string;
        grado_nombre: string;
        categoria_nombre: string;
        id: number;
        nombre: string;
        fecha_nacimiento: Date;
        chip: string;
        id_categoria_talla: number;
        categoriaTalla: import("../entities/categoria-talla.entity").CategoriaTalla;
        id_grado_actual: number;
        gradoActual: import("../entities/grado.entity").Grado;
        id_raza: number;
        raza: import("../entities/raza.entity").Raza;
        observaciones: string;
        flg_activo: boolean;
        fec_creacion: Date;
        fec_actualizacion: Date;
    }[]>;
    addMyDog(data: any, req: any): Promise<any>;
    updateMyDog(id: number, data: any, req: any): Promise<any>;
    deactivateMyDog(id: number, req: any): Promise<{
        success: boolean;
    }>;
    getActiveCompetitions(): Promise<import("../entities/competencia.entity").Competencia[]>;
    registerForCompetition(competitionId: number, dogId: number, req: any): Promise<{
        message: string;
        success?: undefined;
        registeredPistas?: undefined;
    } | {
        success: boolean;
        registeredPistas: number[];
        message: string;
    }>;
    getDogStats(id: number, req: any): Promise<{
        stats: {
            competitions: {
                total: number;
                active: number;
                pending: number;
            };
            tracks: {
                total: number;
                active: number;
                pending: number;
            };
            excellentTracks: number;
            cleanRunPercentage: number;
        };
        trendData: {
            date: Date;
            speed: number;
            track: string;
        }[];
        recentActivity: {
            id: number;
            eventName: string;
            trackName: string;
            date: Date;
            result: string;
            speed: string;
            place: string;
            isClean: boolean;
        }[];
    }>;
    getDogRegistrations(id: number, req: any): Promise<number[]>;
    getDogInsights(id: number, req: any): Promise<{
        analysis: {
            totalRaces: number;
            speedImprovement: number;
            cleanRunRate: number;
            eliminationRate: number;
            podiums?: undefined;
        };
        insights: {
            title: string;
            type: string;
            text: string;
        }[];
    } | {
        analysis: {
            totalRaces: number;
            speedImprovement: number;
            cleanRunRate: number;
            eliminationRate: number;
            podiums: number;
        };
        insights: {
            title: string;
            type: string;
            text: string;
        }[];
    }>;
    getAllMyResults(req: any, page?: number, limit?: number, search?: string, competitionId?: number, dogId?: number, trackType?: string, gradeId?: number): Promise<{
        data: {
            id: number;
            eventName: string;
            date: Date;
            trackType: string;
            gradeName: string;
            dogName: string;
            speed: string;
            faults: number;
            refusals: number;
            time: number;
            isEli: boolean;
            place: number;
            points: number;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMyCompetitionsSummary(req: any): Promise<Record<number, {
        status: string;
        bestResult?: string;
    }>>;
    getGlobalStats(): Promise<{
        stats: {
            competitions: {
                total: number;
            };
            tracks: {
                total: number;
            };
            activeDuplas: number;
        };
        recentActivity: {
            id: number;
            eventName: string;
            trackName: string;
            dogName: string;
            date: Date;
            result: string;
            speed: string;
            place: string;
            isClean: boolean;
        }[];
    }>;
    getAllDogs(): Promise<import("../entities/perro.entity").Perro[]>;
}
