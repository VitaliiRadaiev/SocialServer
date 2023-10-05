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
exports.UsersService = void 0;
const types_1 = require("../types");
const user_entity_1 = require("./user.entity");
const users_repository_1 = require("./users.repository");
const inversify_1 = require("inversify");
require("reflect-metadata");
const profile_services_1 = require("../profile/profile.services");
let UsersService = exports.UsersService = class UsersService {
    constructor(configService, usersRepository, profileService) {
        this.configService = configService;
        this.usersRepository = usersRepository;
        this.profileService = profileService;
    }
    createUser({ email, login, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_entity_1.User(email, login);
            const salt = this.configService.get('SALT');
            yield newUser.setPassword(password, Number(salt));
            const existedUser = yield this.usersRepository.find({ email });
            if (existedUser) {
                return null;
            }
            const user = yield this.usersRepository.create(newUser);
            yield this.profileService.updateProfile(user.id, { fullName: user.login });
            return user;
        });
    }
    validateUser({ email, password }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const existedUser = yield this.usersRepository.find({ email });
            if (!existedUser)
                return {
                    user: existedUser,
                    isValidate: false
                };
            const newUser = new user_entity_1.User(existedUser.email, existedUser.login, (_a = existedUser.password) === null || _a === void 0 ? void 0 : _a.password);
            return {
                user: existedUser,
                isValidate: yield newUser.comparePassword(password)
            };
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.find({ email });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.find({ id });
        });
    }
    getUsers(userId, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.usersRepository.count(userId, queries.term ? queries.term : null);
            const users = yield this.usersRepository.getUsers(userId, queries.count ? Number(queries.count) : null, queries.page ? Number(queries.page) : null, queries.term ? queries.term : null);
            if (count && users) {
                const currentUser = yield this.usersRepository.find({ id: userId });
                const subscriptionsArray = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.followed) && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.followed.split(',')) || [];
                const data = users.map(user => {
                    var _a, _b, _c, _d, _e;
                    const isFollow = subscriptionsArray === null || subscriptionsArray === void 0 ? void 0 : subscriptionsArray.includes(String(user.id));
                    return {
                        email: user.email,
                        login: user.login,
                        id: user.id,
                        photos: {
                            small: (_b = (_a = user.profile) === null || _a === void 0 ? void 0 : _a.photos) === null || _b === void 0 ? void 0 : _b.small,
                            large: (_d = (_c = user.profile) === null || _c === void 0 ? void 0 : _c.photos) === null || _d === void 0 ? void 0 : _d.large,
                        },
                        status: (_e = user.profile) === null || _e === void 0 ? void 0 : _e.status,
                        followed: isFollow ? true : false,
                    };
                });
                return {
                    items: data,
                    totalCount: count
                };
            }
            else {
                return {
                    items: [],
                    totalCount: 0
                };
            }
        });
    }
    getFriendUsers(userId, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.usersRepository.find({ id: userId });
            const subscriptionsArray = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.followed) && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.followed.split(',').filter(i => i != ''));
            if (Array.isArray(subscriptionsArray) && subscriptionsArray.length) {
                let users = [];
                for (let userId of subscriptionsArray) {
                    let user = yield this.usersRepository.find({ id: Number(userId) });
                    users.push(user);
                }
                let data = users.map(user => {
                    var _a, _b, _c, _d, _e;
                    return {
                        login: user.login,
                        id: user.id,
                        photos: {
                            small: (_b = (_a = user.profile) === null || _a === void 0 ? void 0 : _a.photos) === null || _b === void 0 ? void 0 : _b.small,
                            large: (_d = (_c = user.profile) === null || _c === void 0 ? void 0 : _c.photos) === null || _d === void 0 ? void 0 : _d.large,
                        },
                        status: (_e = user.profile) === null || _e === void 0 ? void 0 : _e.status,
                        followed: true
                    };
                });
                if (typeof queries.term === 'string') {
                    data = data.filter(user => {
                        let reqExpt = new RegExp(String(queries.term), 'ig');
                        return reqExpt.test(user.login);
                    });
                }
                const totalCount = data.length;
                const count = queries.count ? Number(queries.count) : 10;
                const page = queries.page ? Number(queries.page) : 1;
                const skip = page > 1 ? count * (page - 1) : 0;
                data = data.slice(skip, skip + count);
                return {
                    items: data,
                    totalCount: totalCount
                };
            }
            else {
                return {
                    items: [],
                    totalCount: 0
                };
            }
        });
    }
};
exports.UsersService = UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ProfileService)),
    __metadata("design:paramtypes", [Object, users_repository_1.UsersRepository,
        profile_services_1.ProfileServices])
], UsersService);
//# sourceMappingURL=users.service.js.map