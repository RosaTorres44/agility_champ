import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ResultadoPista } from '../entities/resultado-pista.entity';
import { Pista } from '../entities/pista.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { RankingService } from '../ranking/ranking.service';
import { RankingPuntaje } from '../entities/ranking-puntaje.entity';

@Injectable()
export class ResultsService {
    constructor(
        @InjectRepository(ResultadoPista)
        private resultsRepo: Repository<ResultadoPista>,
        @InjectRepository(Pista)
        private pistaRepo: Repository<Pista>,
        @InjectRepository(Inscripcion)
        private inscripcionRepo: Repository<Inscripcion>,
        @InjectRepository(RankingPuntaje)
        private rankingRepo: Repository<RankingPuntaje>,
        private rankingService: RankingService
    ) { }

    async getInscriptions(trackId: number) {
        return this.inscripcionRepo.find({
            where: { id_pista: trackId, flg_activo: true },
            relations: ['dupla', 'dupla.perro', 'dupla.guia']
        });
    }

    async addInscription(trackId: number, duplaId: number) {
        // Check if exists
        const exists = await this.inscripcionRepo.findOne({ where: { id_pista: trackId, id_dupla: duplaId } });
        if (exists) {
            // Re-activate if it was inactive
            if (!exists.flg_activo) {
                exists.flg_activo = true;
                return this.inscripcionRepo.save(exists);
            }
            return exists;
        }

        const newIns = this.inscripcionRepo.create({
            id_pista: trackId,
            id_dupla: duplaId
        });
        return this.inscripcionRepo.save(newIns);
    }

    async deactivateInscription(id: number) {
        const ins = await this.inscripcionRepo.findOne({ where: { id } });
        if (ins) {
            ins.flg_activo = false;
            return this.inscripcionRepo.save(ins);
        }
        return null;
    }

    async enterResult(data: any) {
        // data: { id_inscripcion, id_pista, id_dupla, tiempo_cronometrado_seg, faltas, rehuses, es_eli_manual }



        // Find or Create Result using Inscripcion
        // Note: data.id_inscripcion should be passed ideally, or we find it via dupla+pista
        let inscripcionId = data.id_inscripcion;
        if (!inscripcionId && data.id_dupla) {
            const ins = await this.inscripcionRepo.findOne({ where: { id_pista: data.id_pista, id_dupla: data.id_dupla } });
            if (ins) inscripcionId = ins.id;
            else {
                // Auto-inscribe? Or fail? Let's auto-inscribe for robustness or throw
                // For now throw if not found to ensure flow
                const newIns = await this.addInscription(data.id_pista, data.id_dupla);
                inscripcionId = newIns.id;
            }
        }

        let result = await this.resultsRepo.findOne({ where: { id_inscripcion: inscripcionId } });
        if (!result) {
            result = this.resultsRepo.create({
                id_inscripcion: inscripcionId,
                id_pista: data.id_pista,
                id_dupla: data.id_dupla, // Keep denormalized columns for now
                id_perro: data.id_perro // Should fetch from dupla if not passed, but frontend should pass it or we fetch
            });
            // Fetch Dupla to get Perro if needed
            if (!result.id_perro && result.id_dupla) {
                const inscrip = await this.inscripcionRepo.findOne({ where: { id: inscripcionId }, relations: ['dupla'] });
                if (inscrip) result.id_perro = inscrip.dupla.id_perro;
            }
        }


        // --- Calculation Logic ---
        // 1. Fetch Pista for TMR/TSR params
        const pista = await this.pistaRepo.findOne({ where: { id: data.id_pista }, relations: ['tipoPista', 'competencia'] });
        if (!pista) throw new Error('Pista not found');

        // 2. Constants & Variables
        const time = Number(data.tiempo_cronometrado_seg) || 0;
        const faults = Number(data.faltas) || 0;
        const refusals = Number(data.rehuses) || 0;
        const isManualEli = data.es_eli || false;

        let timePenalty = 0;
        let totalPenalty = 0;
        let isEli = isManualEli;

        // 3. Calculate TSR & TMR (if not already set in Pista entity, calculate dynamically)
        // Note: TSR/TMR should theoretically be stored in Pista, but logic says calculated.
        // Let's rely on Pista properties if they exist, or calculate defaults.
        // Assuming pista.tsr_seg and pista.tmr_seg are authoritative if set.
        const TSR = Number(pista.tsr_seg) || 0;
        const TMR = Number(pista.tmr_seg) || 0;

        // 4. Time Penalty
        if (TSR > 0 && time > TSR) {
            timePenalty = time - TSR;
        }

        // 5. Total Penalty
        // Faltas * 5 + Rehúses * 5 + Time Penalty
        totalPenalty = (faults * 5) + (refusals * 5) + timePenalty;

        // 6. Elimination Logic (Automatic)
        // - 3 Refusals
        // - Time > TMR
        if (refusals >= 3) {
            isEli = true;
        }
        if (TMR > 0 && time > TMR) {
            isEli = true;
        }

        // 7. Eligibility Logic (Rule 15.99)
        // - Penalty <= 15.99 -> Podium Eligible
        // - Not ELI
        const isEligible = !isEli && totalPenalty <= 15.99;

        // --- Update Result Entity ---
        result.tiempo_cronometrado_seg = time;
        result.faltas = faults;
        result.rehuses = refusals;
        result.es_eli = isEli;
        result.penalidad_total_seg = isEli ? 0 : Number(totalPenalty.toFixed(2));
        result.tiempo_total_seg = isEli ? 0 : Number((time + totalPenalty).toFixed(2));
        // Text says "Tiempo total = tiempo cronometrado + penalidades" (Line 112).
        // Usually in agility software: "Total Result" is the penalty sum. 
        // "Time" is just the clock. 
        // Let's store "Tiempo Total" as Time + TimePenalty? 
        // Or strictly following text: Time + Penalties. If Time=30, Fault=1(5s), TimePen=0 -> Total=35?
        // Let's assume text means "Total Result Score".

        result.es_elegible_podio = isEligible;
        result.es_elegible_ranking = isEligible; // Same rule for now
        result.id_inscripcion = inscripcionId; // Ensure link is set

        // Save Result
        const saved = await this.resultsRepo.save(result);

        // Update Pista status if needed
        if (pista.estado === 'creada' || pista.estado === 'armada') {
            pista.estado = 'en_curso';
            await this.pistaRepo.save(pista);
        }

        // --- Post-Save Updates ---
        // 1. Update Placements within the track
        await this.updatePlacements(data.id_pista);

        // 2. Calculate Ranking (If applicable)
        const year = pista.competencia && pista.competencia.anio ? pista.competencia.anio : new Date().getFullYear();
        await this.rankingService.calculateRankingForTrack(data.id_pista, year);

        // Return the FULL updated result including Puesto and Ranking Points
        const savedWithRelations = await this.resultsRepo.findOne({
            where: { id: saved.id },
            relations: ['pista', 'dupla', 'perro', 'inscripcion']
        });

        // Fetch ranking points if any
        const ranking = await this.rankingRepo.findOne({ where: { id_resultado_pista: saved.id } });

        return {
            ...savedWithRelations,
            ranking_points: ranking ? ranking.puntos : 0
        };
    }

    private async updatePlacements(trackId: number) {
        // Fetch eligible results
        // Sort order:
        // 1. Penalidad Total ASC
        // 2. Tiempo Total ASC (or Cronometrado? Text says "Un cerado siempre gana a un penalizado. Empates -> gana el mejor tiempo" (Line 131))
        // Usually agility tie-breaker is Course Time (without faults). But text says "gana el mejor tiempo".
        // Let's use tiempo_cronometrado_seg as tie-breaker.
        // Filter out ELI for placement (ELI gets null placement)

        const results = await this.resultsRepo.find({
            where: { id_pista: trackId, es_eli: false, es_elegible_podio: true }, // Only eligible for podium get placed?
            // Actually, text says >15.99 "No entra a podio". Does it get a placement? Or is it just not Podium?
            // "Puesto" usually implies Rank.
            // Let's place everyone who is not ELI, but only top 3 get Podium flags/points.
            // But verify Rule 9: "No entra a podio".
            // Let's rank EVERYONE who is not ELI.
        });

        // Re-fetch to sort in memory or use query builder. Memory is fine for small batch.
        // Wait, I should fetch ALL non-ELI to rank them.
        const allNonEli = await this.resultsRepo.find({
            where: { id_pista: trackId, es_eli: false },
        });

        // Sort
        allNonEli.sort((a, b) => {
            if (a.penalidad_total_seg !== b.penalidad_total_seg) {
                return a.penalidad_total_seg - b.penalidad_total_seg;
            }
            return a.tiempo_cronometrado_seg - b.tiempo_cronometrado_seg;
        });

        // Assign Puesto
        for (let i = 0; i < allNonEli.length; i++) {
            const r = allNonEli[i];
            r.puesto = i + 1;
            await this.resultsRepo.save(r);
        }


    }

    async getResultsForTrack(trackId: number) {
        const tId = Number(trackId);
        console.log(`[ResultsService] getResultsForTrack (Restored) for ID: ${tId}`);

        try {
            // Step 1: Fetch Inscriptions (Base source of truth for who is in the track)
            const inscriptions = await this.getInscriptions(trackId);

            console.log(`[ResultsService] Inscriptions fetched: ${inscriptions.length}`);

            // Step 2: Results using QueryBuilder
            const results = await this.resultsRepo.createQueryBuilder('r')
                .where('r.id_pista = :trackId', { trackId: tId })
                .getMany();

            console.log(`[ResultsService] Results fetched: ${results.length}`);

            // Step 3: Mapping Result Map
            const resultsMap = new Map();
            results.forEach(r => resultsMap.set(Number(r.id_inscripcion), r));

            // Step 4: Fetch Ranking Points
            let rankingPoints: RankingPuntaje[] = [];
            if (results.length > 0) {
                rankingPoints = await this.rankingRepo.find({
                    where: { id_resultado_pista: In(results.map(r => r.id)) }
                });
            }
            const pointsMap = new Map();
            rankingPoints.forEach(rp => pointsMap.set(Number(rp.id_resultado_pista), rp.puntos));

            // Step 4: Mapping
            const finalData = inscriptions.map(ins => {
                const res = resultsMap.get(Number(ins.id));
                const points = res ? pointsMap.get(Number(res.id)) : null;
                return {
                    inscription: ins,
                    result: res ? { ...res, ranking_points: points } : null
                };
            });
            return finalData;

        } catch (error) {
            console.error('[ResultsService] ERROR in getResultsForTrack:', error);
            throw error;
        }
    }
}
