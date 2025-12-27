import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RankingService } from './ranking.service';

@Controller('ranking')
@UseGuards(AuthGuard('jwt'))
export class RankingController {
    constructor(private readonly rankingService: RankingService) { }

    @Get('national')
    async getNationalRanking(
        @Query('year') year: number,
        @Query('gradeId') gradeId?: number,
        @Query('categoryId') categoryId?: number
    ) {
        return this.rankingService.getNationalRanking(year || new Date().getFullYear(), gradeId, categoryId);
    }
}
