"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFeaturesController = void 0;
const common_1 = require("@nestjs/common");
const client_features_service_1 = require("./client-features.service");
const passport_1 = require("@nestjs/passport");
let ClientFeaturesController = class ClientFeaturesController {
    clientService;
    constructor(clientService) {
        this.clientService = clientService;
    }
    async getMyDogs(req) {
        return this.clientService.getMyDogs(req.user.userId);
    }
    async addMyDog(data, req) {
        return this.clientService.addMyDog(data, req.user.userId, req.user.nombres);
    }
    async updateMyDog(id, data, req) {
        return this.clientService.updateMyDog(id, data, req.user.userId, req.user.nombres);
    }
    async deactivateMyDog(id, req) {
        return this.clientService.deactivateMyDog(id, req.user.userId, req.user.nombres);
    }
    async getActiveCompetitions() {
        return this.clientService.getActiveCompetitions();
    }
    async registerForCompetition(competitionId, dogId, req) {
        return this.clientService.registerForCompetition(competitionId, dogId, req.user.userId);
    }
    async getDogStats(id, req) {
        return this.clientService.getDogStats(id, req.user.userId);
    }
    async getDogRegistrations(id, req) {
        return this.clientService.getDogRegistrations(id, req.user.userId);
    }
    async getDogInsights(id, req) {
        return this.clientService.getDogInsights(id, req.user.userId);
    }
    async getAllMyResults(req, page = 1, limit = 10, search = '', competitionId, dogId, trackType, gradeId) {
        const isAdmin = req.user.id_tipo_persona === 1;
        return this.clientService.getAllMyResults(req.user.userId, page, limit, search, {
            competitionId,
            dogId,
            trackType,
            gradeId
        }, isAdmin);
    }
    async getMyCompetitionsSummary(req) {
        return this.clientService.getMyCompetitionsSummary(req.user.userId);
    }
    async getGlobalStats() {
        return this.clientService.getGlobalStats();
    }
    async getAllDogs() {
        return this.clientService.getAllDogs();
    }
};
exports.ClientFeaturesController = ClientFeaturesController;
__decorate([
    (0, common_1.Get)('my-dogs'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getMyDogs", null);
__decorate([
    (0, common_1.Post)('my-dogs'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "addMyDog", null);
__decorate([
    (0, common_1.Put)('my-dogs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "updateMyDog", null);
__decorate([
    (0, common_1.Delete)('my-dogs/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "deactivateMyDog", null);
__decorate([
    (0, common_1.Get)('active-competitions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getActiveCompetitions", null);
__decorate([
    (0, common_1.Post)('competitions/:id/register'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('dogId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "registerForCompetition", null);
__decorate([
    (0, common_1.Get)('dogs/:id/stats'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getDogStats", null);
__decorate([
    (0, common_1.Get)('dogs/:id/registrations'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getDogRegistrations", null);
__decorate([
    (0, common_1.Get)('dogs/:id/insights'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getDogInsights", null);
__decorate([
    (0, common_1.Get)('my-results'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('competitionId')),
    __param(5, (0, common_1.Query)('dogId')),
    __param(6, (0, common_1.Query)('trackType')),
    __param(7, (0, common_1.Query)('gradeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getAllMyResults", null);
__decorate([
    (0, common_1.Get)('competitions/summary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getMyCompetitionsSummary", null);
__decorate([
    (0, common_1.Get)('admin/global-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Get)('admin/all-dogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientFeaturesController.prototype, "getAllDogs", null);
exports.ClientFeaturesController = ClientFeaturesController = __decorate([
    (0, common_1.Controller)('client'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [client_features_service_1.ClientFeaturesService])
], ClientFeaturesController);
//# sourceMappingURL=client-features.controller.js.map