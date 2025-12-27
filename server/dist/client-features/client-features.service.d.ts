import { Repository } from 'typeorm';
import { Perro } from '../entities/perro.entity';
import { Dupla } from '../entities/dupla.entity';
import { Competencia } from '../entities/competencia.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Pista } from '../entities/pista.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';
import { MaintenanceService } from '../maintenance/maintenance.service';
export declare class ClientFeaturesService {
    private perroRepo;
    private duplaRepo;
    private competenciaRepo;
    private inscripcionRepo;
    private pistaRepo;
    private resultadoRepo;
    private maintenanceService;
    constructor(perroRepo: Repository<Perro>, duplaRepo: Repository<Dupla>, competenciaRepo: Repository<Competencia>, inscripcionRepo: Repository<Inscripcion>, pistaRepo: Repository<Pista>, resultadoRepo: Repository<ResultadoPista>, maintenanceService: MaintenanceService);
    getMyDogs(userId: number): Promise<{
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
    addMyDog(data: any, userId: number, userName: string): Promise<any>;
    private verifyDogOwnership;
    updateMyDog(id: number, data: any, userId: number, userName: string): Promise<any>;
    getAllMyResults(userId: number, page?: number, limit?: number, search?: string, filters?: any, isAdmin?: boolean): Promise<{
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
    deactivateMyDog(id: number, userId: number, userName: string): Promise<{
        success: boolean;
    }>;
    getActiveCompetitions(): Promise<Competencia[]>;
    registerForCompetition(competitionId: number, dogId: number, userId: number): Promise<{
        message: string;
        success?: undefined;
        registeredPistas?: undefined;
    } | {
        success: boolean;
        registeredPistas: number[];
        message: string;
    }>;
    getDogStats(dogId: number, userId: number): Promise<{
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
    getDogRegistrations(dogId: number, userId: number): Promise<number[]>;
    getMyCompetitionsSummary(userId: number): Promise<Record<number, {
        status: string;
        bestResult?: string;
    }>>;
    getDogInsights(dogId: number, userId: number): Promise<{
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
    getAllDogs(): Promise<Perro[]>;
}
