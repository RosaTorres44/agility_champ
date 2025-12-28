import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) { }

    @Get('inscriptions/:trackId')
    async getInscriptions(@Param('trackId') trackId: string) {
        console.log(`[ResultsController] Fetching inscriptions for track: ${trackId}`);
        const data = await this.resultsService.getInscriptions(+trackId);
        console.log(`[ResultsController] Found ${data.length} inscriptions.`);
        return data;
    }

    @Post('inscriptions')
    addInscription(@Body() body: { trackId: number, duplaId: number }) {
        return this.resultsService.addInscription(body.trackId, body.duplaId);
    }

    @Post('inscriptions/:id/deactivate')
    deactivateInscription(@Param('id') id: string) {
        return this.resultsService.deactivateInscription(+id);
    }

    @Post()
    enterResult(@Body() body: any) {
        return this.resultsService.enterResult(body);
    }

    @Get('track/:trackId')
    @Get('track/:trackId')
    getResults(@Param('trackId') trackId: string) {
        return this.resultsService.getResultsForTrack(+trackId);
    }
}
