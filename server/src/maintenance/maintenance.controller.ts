import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('maintenance')
@UseGuards(AuthGuard('jwt'))
export class MaintenanceController {
    constructor(private readonly maintenanceService: MaintenanceService) { }

    @Get(':entity')
    @Get(':entity')
    async findAll(@Param('entity') entity: string) {
        console.log(`[MaintenanceController] findAll called for: ${entity}`);
        const result = await this.maintenanceService.findAll(entity);
        if (entity === 'pista') {
            console.log(`[MaintenanceController] Returning ${result.length} pistas:`, JSON.stringify(result));
        }
        return result;
    }

    @Post(':entity')
    async create(@Param('entity') entity: string, @Body() body: any, @Request() req: any) {
        try {
            console.log(`[${new Date().toISOString()}] Incoming POST /${entity}: ${JSON.stringify(body)}`);
            // req.user is populated by JwtStrategy
            return await this.maintenanceService.create(entity, body, req.user.userId, req.user.nombres);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in controller ${entity}:`, error);
            throw error;
        }
    }

    @Put(':entity/:id')
    update(
        @Param('entity') entity: string,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @Request() req: any
    ) {
        return this.maintenanceService.update(entity, id, body, req.user.userId, req.user.nombres);
    }

    @Delete(':entity/:id')
    deactivate(
        @Param('entity') entity: string,
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        return this.maintenanceService.deactivate(entity, id, req.user.userId, req.user.nombres);
    }

    @Patch(':entity/:id/reactivate')
    reactivate(
        @Param('entity') entity: string,
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ) {
        return this.maintenanceService.reactivate(entity, id, req.user.userId, req.user.nombres);
    }
}

