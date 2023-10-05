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
exports.UsersRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
require("reflect-metadata");
let UsersRepository = exports.UsersRepository = class UsersRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    create({ email, password, login }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.create({
                data: {
                    email,
                    login,
                    password: {
                        create: {
                            password
                        }
                    },
                    profile: {
                        create: {
                            lookingForAJob: false,
                            contacts: {
                                create: {}
                            },
                            photos: {
                                create: {}
                            }
                        }
                    }
                }
            });
        });
    }
    find(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.findFirst({
                where: Object.assign({}, obj),
                include: {
                    password: true,
                    profile: {
                        include: {
                            contacts: true,
                            photos: true
                        }
                    }
                }
            });
        });
    }
    getUsers(userId, count, page, term) {
        return __awaiter(this, void 0, void 0, function* () {
            let countOfPage = count ? count : 10;
            let pageOfNum = page ? (page > 1) ? (countOfPage * (page - 1)) : 0 : 0;
            let options = {
                take: countOfPage,
                skip: pageOfNum,
                include: {
                    profile: {
                        include: {
                            contacts: true,
                            photos: true
                        }
                    }
                },
                where: {
                    NOT: {
                        id: userId
                    }
                }
            };
            if (term === null || term === void 0 ? void 0 : term.trim()) {
                options = Object.assign(Object.assign({}, options), { where: {
                        login: {
                            contains: term
                        }
                    } });
            }
            return this.prismaService.client.userModel.findMany(options);
        });
    }
    getFriendUsers(userId, count, page, term) {
        return __awaiter(this, void 0, void 0, function* () {
            let countOfPage = count ? count : 10;
            let pageOfNum = page ? (page > 1) ? (countOfPage * (page - 1)) : 0 : 0;
            let options = {
                take: countOfPage,
                skip: pageOfNum,
                include: {
                    profile: {
                        include: {
                            contacts: true,
                            photos: true
                        }
                    }
                },
                where: {
                    NOT: {
                        id: userId
                    }
                }
            };
            if (term === null || term === void 0 ? void 0 : term.trim()) {
                options = Object.assign(Object.assign({}, options), { where: {
                        login: {
                            contains: term
                        }
                    } });
            }
            return this.prismaService.client.userModel.findMany(options);
        });
    }
    count(userId, term) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                where: {
                    NOT: {
                        id: userId
                    }
                }
            };
            if (term === null || term === void 0 ? void 0 : term.trim()) {
                options = Object.assign(Object.assign({}, options), { where: {
                        login: {
                            contains: term
                        },
                        NOT: {
                            id: userId
                        }
                    } });
            }
            return this.prismaService.client.userModel.count(options);
        });
    }
    updateFollows(id, usersId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.update({
                where: {
                    id,
                },
                data: {
                    followed: usersId
                }
            });
        });
    }
    updateDialogs(id, usersId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.update({
                where: {
                    id,
                },
                data: {
                    dialogs: usersId
                }
            });
        });
    }
};
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map