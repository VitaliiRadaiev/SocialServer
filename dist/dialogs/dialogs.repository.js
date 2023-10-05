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
exports.DialogsRepository = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
let DialogsRepository = exports.DialogsRepository = class DialogsRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    createDialog(members) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.dialogModel.create({
                data: {
                    members
                }
            });
        });
    }
    deleteDialog(dialogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.dialogModel.delete({
                where: {
                    id: dialogId
                }
            });
        });
    }
    updateDialog(dialogId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.dialogModel.update({
                where: {
                    id: dialogId
                },
                data: {
                    members
                }
            });
        });
    }
    getDialog(dialogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.dialogModel.findFirst({
                where: {
                    id: dialogId
                },
                include: {
                    messages: {
                        take: -1,
                    }
                }
            });
        });
    }
    createMessage(userId, dialogId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.messageModel.create({
                data: {
                    createdAt: new Date().toISOString(),
                    userId,
                    text: text.trim(),
                    dialogId
                }
            });
        });
    }
    deleteMessage(dialogId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.messageModel.delete({
                where: {
                    id: messageId
                }
            });
        });
    }
    deleteMessages(dialogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.messageModel.deleteMany({
                where: {
                    dialogId: dialogId
                }
            });
        });
    }
    getMessages(dialogId, count, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let countOfPage = count ? count : 10;
            let pageOfNum = page ? (page > 1) ? (countOfPage * (page - 1)) : 0 : 0;
            let options = {
                take: page ? countOfPage : (countOfPage * -1),
                skip: pageOfNum,
                where: {
                    dialogId
                }
            };
            return this.prismaService.client.messageModel.findMany(options);
        });
    }
    countMessages(dialogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.messageModel.count({
                where: {
                    dialogId
                }
            });
        });
    }
};
exports.DialogsRepository = DialogsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DialogsRepository);
//# sourceMappingURL=dialogs.repository.js.map