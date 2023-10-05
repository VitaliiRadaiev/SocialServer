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
exports.FollowController = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const base_controller_1 = require("../common/base.controller");
const types_1 = require("../types");
const auth_middleware_1 = require("../common/auth.middleware");
let FollowController = exports.FollowController = class FollowController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, followService) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.followService = followService;
        this.bindRoutes([
            { path: '/:id', method: 'get', func: this.isFollow, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/:id', method: 'post', func: this.follow, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/:id', method: 'delete', func: this.unFollow, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
        ]);
    }
    isFollow(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number(req.params.id)) {
                    this.error(res, 400, 'Bad Request, ID must be number');
                    return;
                }
                let result = yield this.followService.isFollow(Number(req.user.id), Number(req.params.id));
                if (result) {
                    this.ok(res, '', { follow: true });
                }
                else {
                    this.ok(res, '', { follow: false });
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    follow(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number(req.params.id)) {
                    this.error(res, 400, 'Bad Request, ID must be number');
                    return;
                }
                if (Number(req.params.id) === Number(req.user.id)) {
                    this.error(res, 400, 'Bad Request, you can\'t follow self');
                    return;
                }
                let result = yield this.followService.follow(Number(req.user.id), Number(req.params.id));
                if (result) {
                    this.ok(res, '', { message: 'successful' });
                }
                else {
                    this.error(res, 404, { message: 'unsuccessful, user nor found' });
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    unFollow(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number(req.params.id)) {
                    this.error(res, 400, 'Bad Request, ID must be number');
                    return;
                }
                if (Number(req.params.id) === Number(req.user.id)) {
                    this.error(res, 400, 'Bad Request, you can\'t unfollow self');
                    return;
                }
                let result = yield this.followService.unFollow(Number(req.user.id), Number(req.params.id));
                if (result) {
                    this.ok(res, '', { message: 'successful' });
                }
                else {
                    this.error(res, 404, { message: 'unsuccessful, user nor found' });
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
};
exports.FollowController = FollowController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.FollowService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], FollowController);
//# sourceMappingURL=follow.controller.js.map