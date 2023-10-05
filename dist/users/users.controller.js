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
exports.UsersController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const validate_middleware_1 = require("../common/validate.middleware");
const users_register_dto_1 = require("./dto/users-register.dto");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_middleware_1 = require("../common/auth.middleware");
let UsersController = exports.UsersController = class UsersController extends base_controller_1.BaseController {
    constructor(loggerservice, userService, configService) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.userService = userService;
        this.configService = configService;
        this.bindRoutes([
            { path: '/register', method: 'post', func: this.register, middlewares: [new validate_middleware_1.ValidateMiddleware(users_register_dto_1.UsersRegisterDto)] },
            { path: '/login', method: 'post', func: this.login, middlewares: [] },
            { path: '/me', method: 'get', func: this.me, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/', method: 'get', func: this.users, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
        ]);
    }
    register({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.createUser(body);
                if (!result) {
                    this.error(res, 422, 'This user already exists.');
                    return;
                }
                this.ok(res, '', Object.assign({}, result));
                return;
            }
            catch (error) {
                this.error(res, 422, 'This user already exists.');
                return;
            }
        });
    }
    login(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.validateUser(req.body);
            if (!result.isValidate) {
                this.error(res, 401, 'Authorisation Error [login]');
                return;
            }
            const jwt = yield this.signJWT((_a = result.user) === null || _a === void 0 ? void 0 : _a.id, (_b = result.user) === null || _b === void 0 ? void 0 : _b.email, this.configService.get('SECRET'));
            this.ok(res, '', { jwt });
        });
    }
    me(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserByEmail(req.user.email);
            if (user) {
                this.ok(res, '', { id: user.id, email: user.email, login: user.login });
            }
            else {
                this.error(res, 404, 'User not found');
            }
        });
    }
    users(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.query.friend === 'true') {
                const users = yield this.userService.getFriendUsers(req.user.id, req.query);
                this.ok(res, '', Object.assign({}, users));
            }
            else {
                const users = yield this.userService.getUsers(req.user.id, req.query);
                this.ok(res, '', Object.assign({}, users));
            }
        });
    }
    signJWT(id, email, secret) {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)({
                id,
                email,
                iat: Math.floor(Date.now() / 1000),
            }, secret, {
                algorithm: 'HS256'
            }, (err, token) => {
                if (err)
                    reject(err);
                resolve(token);
            });
        });
    }
};
exports.UsersController = UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UsersService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UsersController);
//# sourceMappingURL=users.controller.js.map