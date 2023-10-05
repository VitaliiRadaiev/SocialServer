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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRepository = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
let ProfileRepository = exports.ProfileRepository = class ProfileRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.profileModel.findFirst({
                where: {
                    userId: id
                },
                include: {
                    contacts: true,
                    photos: true
                }
            });
        });
    }
    updateProfile(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.profileModel.update({
                where: {
                    userId: id,
                },
                data: newData,
            });
        });
    }
    updateContacts(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.contactsModel.update({
                where: {
                    profileId: id,
                },
                data: newData,
            });
        });
    }
    updatePhotos(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.photosModel.update({
                where: {
                    profileId: id,
                },
                data: newData,
            });
        });
    }
};
exports.ProfileRepository = ProfileRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileRepository);
//# sourceMappingURL=profile.repository.js.map