import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RankingPuntaje } from '../entities/ranking-puntaje.entity';
import { ResultadoPista } from '../entities/resultado-pista.entity';

@Injectable()
export class RankingService {
    constructor(
        @InjectRepository(RankingPuntaje)
        private rankingRepo: Repository<RankingPuntaje>,
        @InjectRepository(ResultadoPista)
        private resultsRepo: Repository<ResultadoPista>,
    ) { }

    // Calculate points for a closed track
    async calculateRankingForTrack(trackId: number, year: number) {
        const fs = require('fs');
        const logFile = 'ranking_debug.log';
        const log = (msg: string) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

        try {
            // 1. Clean previous calculation for this track
            const existingResults = await this.resultsRepo.find({ where: { id_pista: trackId }, select: ['id'] });
            const existingIds = existingResults.map(r => r.id);

            if (existingIds.length > 0) {
                await this.rankingRepo.delete({ id_resultado_pista: In(existingIds) });
            }

            const results = await this.resultsRepo.find({
                where: { id_pista: trackId, es_eli: false, es_elegible_ranking: true },
                relations: ['pista', 'pista.tipoPista', 'pista.gradoBase', 'dupla', 'dupla.perro'],
                order: { penalidad_total_seg: 'ASC', tiempo_cronometrado_seg: 'ASC' }
            });

            if (results.length === 0) {
                log(`[RankingService] No results found for track ${trackId}`);
                return { message: 'No eligible results found' };
            }

            const trackType = results[0].pista.tipoPista.cod; // AGILITY or JUMPING
            const trackGrade = results[0].pista.gradoBase.cod; // G1, G2, G3

            log(`[RankingService] Track ${trackId} Type: ${trackType}, Grade: ${trackGrade}`);

            // Rule: Only G2 and G3, and not Senior
            if (['G0', 'G1'].includes(trackGrade)) {
                log(`[RankingService] Skipped: Grade ${trackGrade} not eligible`);
                return { message: 'Grade not eligible for National Ranking' };
            }

            const pointsMap = {
                AGILITY: {
                    clean: [10, 8, 6], // 1st, 2nd, 3rd (0 faults)
                    penalty: [8, 6, 4] // 1st, 2nd, 3rd (<= 15.99)
                },
                JUMPING: {
                    clean: [7, 5, 3],
                    penalty: [5, 3, 1]
                }
            };

            const config = (pointsMap as any)[trackType] || pointsMap['AGILITY']; // Fallback

            let assignedCount = 0;
            const savedPoints = [];

            log(`[RankingService] Processing ${results.length} results for ranking...`);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                // Skip Seniors
                if (result.categoria_competitiva === 'SENIOR') {
                    log(`[RankingService] Result ${result.id}: Skipped (SENIOR)`);
                    continue;
                }

                // Skip > 15.99 penalties (Already likely handled by es_eli logic or filter, but double check)
                if (Number(result.penalidad_total_seg) > 15.99) {
                    log(`[RankingService] Result ${result.id}: Skipped (Penalty > 15.99)`);
                    continue;
                }

                // Assign Puesto (1-based index among eligibles)
                const place = assignedCount + 1;
                if (place > 3) break; // Only top 3 get points

                const isClean = Number(result.penalidad_total_seg) === 0;
                const pointsTable = isClean ? config.clean : config.penalty;
                const points = pointsTable[place - 1];

                log(`[RankingService] Result ${result.id}: Assigning ${points} points (Place ${place})`);

                const rankingEntry = this.rankingRepo.create({
                    anio: year,
                    id_resultado_pista: result.id,
                    id_dupla: result.id_dupla,
                    puntos: points,
                    motivo: `${place}º Place (${isClean ? 'Clean' : 'Penalty'}) - ${trackType}`
                });

                await this.rankingRepo.save(rankingEntry);
                savedPoints.push(rankingEntry);
                assignedCount++;
            }

            return { message: 'Ranking calculated', details: savedPoints };
        } catch (e) {
            const fs = require('fs'); // in case it failed before definition
            fs.appendFileSync('ranking_debug.log', `ERROR: ${e.message}\n${e.stack}\n`);
            throw e;
        }
    }

    async getNationalRanking(year: number, gradeId?: number, categoryId?: number) {
        try {
            console.log(`[RankingService] Calculating ranking (IGNORING YEAR)`);

            // Full Query with Joins
            const query = this.rankingRepo.createQueryBuilder('rp')
                .leftJoinAndSelect('rp.dupla', 'd')
                .leftJoinAndSelect('d.perro', 'p')
                .leftJoinAndSelect('d.guia', 'g')
                .leftJoinAndSelect('p.raza', 'r')
                .leftJoinAndSelect('p.gradoActual', 'gr')
                .leftJoinAndSelect('p.categoriaTalla', 'ct')
                .select([
                    'rp.id_dupla AS id',
                    'p.nombre AS perro',
                    'g.nombres AS guia_nombres',
                    'g.apellidos AS guia_apellidos',
                    'ct.nombre AS categoria',
                    'gr.nombre AS grado',
                    'r.descripcion AS raza',
                    'SUM(rp.puntos) AS puntos'
                ])
                .where('rp.anio = :year', { year })
                .groupBy('rp.id_dupla')
                .addGroupBy('p.nombre')
                .addGroupBy('g.nombres')
                .addGroupBy('g.apellidos')
                .addGroupBy('ct.nombre')
                .addGroupBy('gr.nombre')
                .addGroupBy('r.descripcion')
                .orderBy('puntos', 'DESC');

            if (gradeId) {
                query.andWhere('p.id_grado_actual = :gradeId', { gradeId });
            }

            if (categoryId) {
                query.andWhere('p.id_categoria_talla = :categoryId', { categoryId });
            }

            const rawResults = await query.getRawMany();

            return rawResults.map((r, index) => ({
                puesto: index + 1,
                dupla: `${r.perro} & ${r.guia_nombres} ${r.guia_apellidos}`,
                categoria: `${r.categoria} - ${r.grado}`,
                puntos: Number(r.puntos),
                raza: r.raza || 'Desconocida'
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
