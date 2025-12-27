import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { ClientFeaturesService } from './client-features.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('client')
@UseGuards(AuthGuard('jwt'))
export class ClientFeaturesController {
    constructor(private readonly clientService: ClientFeaturesService) { }

    @Get('my-dogs')
    async getMyDogs(@Request() req: any) {
        return this.clientService.getMyDogs(req.user.userId);
    }

    @Post('my-dogs')
    async addMyDog(@Body() data: any, @Request() req: any) {
        // Reuse MaintenanceService logic internally in service
        return this.clientService.addMyDog(data, req.user.userId, req.user.nombres);
    }

    @Put('my-dogs/:id')
    async updateMyDog(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: any,
        @Request() req: any
    ) {
        return this.clientService.updateMyDog(id, data, req.user.userId, req.user.nombres);
    }

    @Delete('my-dogs/:id')
    async deactivateMyDog(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        return this.clientService.deactivateMyDog(id, req.user.userId, req.user.nombres);
    }

    @Get('active-competitions')
    async getActiveCompetitions() {
        return this.clientService.getActiveCompetitions();
    }

    @Post('competitions/:id/register')
    async registerForCompetition(
        @Param('id', ParseIntPipe) competitionId: number,
        @Body('dogId', ParseIntPipe) dogId: number,
        @Request() req: any
    ) {
        return this.clientService.registerForCompetition(competitionId, dogId, req.user.userId);
    }

    @Get('dogs/:id/stats')
    async getDogStats(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.clientService.getDogStats(id, req.user.userId);
    }

    @Get('dogs/:id/registrations')
    async getDogRegistrations(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.clientService.getDogRegistrations(id, req.user.userId);
    }

    @Get('dogs/:id/insights')
    async getDogInsights(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
        return this.clientService.getDogInsights(id, req.user.userId);
    }



    @Get('my-results')
    async getAllMyResults(
        @Request() req: any,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = '',
        @Query('competitionId') competitionId?: number,
        @Query('dogId') dogId?: number,
        @Query('trackType') trackType?: string,
        @Query('gradeId') gradeId?: number
    ) {
        // Check if admin (id_tipo_persona 1)
        const isAdmin = req.user.id_tipo_persona === 1;
        return this.clientService.getAllMyResults(req.user.userId, page, limit, search, {
            competitionId,
            dogId,
            trackType,
            gradeId
        }, isAdmin);
    }

    @Get('competitions/summary')
    async getMyCompetitionsSummary(@Request() req: any) {
        return this.clientService.getMyCompetitionsSummary(req.user.userId);
    }

    // --- Admin Endpoints ---

    @Get('admin/global-stats')
    async getGlobalStats() {
        return this.clientService.getGlobalStats();
    }

    @Get('admin/all-dogs')
    async getAllDogs() {
        return this.clientService.getAllDogs();
    }
}
