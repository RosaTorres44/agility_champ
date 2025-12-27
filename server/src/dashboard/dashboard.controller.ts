import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    // @UseGuards(AuthGuard('jwt')) // Uncomment when frontend sends bearer token
    async getStats(@Query('userId') userId: number, @Query('roleId') roleId: number) {
        return this.dashboardService.getStats(Number(userId), Number(roleId));
    }
}
