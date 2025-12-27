import { Controller, Get, Param } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';

@Controller('competitions')
export class CompetitionsController {
    constructor(private readonly competitionsService: CompetitionsService) { }

    @Get()
    findAll() {
        return this.competitionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.competitionsService.findOne(+id);
    }

    @Get(':id/tracks')
    getTracks(@Param('id') id: string) {
        return this.competitionsService.getTracksForCompetition(+id);
    }
}
