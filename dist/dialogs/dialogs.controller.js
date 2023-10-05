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
exports.DialogsController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const auth_middleware_1 = require("../common/auth.middleware");
let DialogsController = exports.DialogsController = class DialogsController extends base_controller_1.BaseController {
    constructor(loggerservice, dialogsService, configService) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.dialogsService = dialogsService;
        this.configService = configService;
        this.bindRoutes([
            { path: '/', method: 'get', func: this.getDialogs, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/', method: 'delete', func: this.deleteDialog, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/', method: 'post', func: this.createDialog, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/addUser', method: 'post', func: this.addUserToDialog, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/removeUser', method: 'post', func: this.removeUserFromDialog, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/messages/:id', method: 'get', func: this.getMessages, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/messages', method: 'post', func: this.createMessage, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            { path: '/messages', method: 'delete', func: this.deleteMessage, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
        ]);
    }
    createDialog({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.userId) {
                    const result = yield this.dialogsService.createDialog(user.id, Number(body.userId));
                    if (result) {
                        this.ok(res, '', Object.assign({}, result));
                    }
                    else {
                        this.error(res, 404, 'User not found');
                    }
                }
                else {
                    this.error(res, 400, 'Bad Request');
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    deleteDialog({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!body.dialogId) {
                    this.error(res, 400, 'Bad request');
                    return;
                }
                const result = yield this.dialogsService.deleteDialog(Number(body.dialogId));
                if (result) {
                    this.ok(res, '', { message: 'success' });
                }
                else {
                    this.error(res, 400, { message: 'unsuccess' });
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    getDialogs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dialogs = yield this.dialogsService.getDialogs(req.user.id);
                this.ok(res, '', { items: dialogs ? dialogs : [] });
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    addUserToDialog({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.dialogId && body.userId) {
                    if (Number(body.userId) === user.id) {
                        this.error(res, 400, 'Bad Request, can\'t use your own id');
                        return;
                    }
                    const result = yield this.dialogsService.addUserToDialog(Number(body.dialogId), Number(body.userId));
                    if (result) {
                        this.ok(res, '', Object.assign({}, result));
                    }
                    else {
                        this.error(res, 400, 'The user or dialog does not exist');
                    }
                }
                else {
                    this.error(res, 400, 'Bad Request');
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    removeUserFromDialog({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (body.dialogId && body.userId) {
                    if (Number(body.userId) === user.id) {
                        this.error(res, 400, 'Bad Request, can\'t use your own id');
                        return;
                    }
                    const result = yield this.dialogsService.removeUserFromDialog(Number(body.dialogId), Number(body.userId));
                    if (result) {
                        this.ok(res, '', Object.assign({}, result));
                    }
                    else {
                        this.error(res, 400, 'The user or dialog does not exist');
                    }
                }
                else {
                    this.error(res, 400, 'Bad Request');
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Number(req.params.id)) {
                    this.error(res, 400, 'Bad Request, id must be number');
                }
                const result = yield this.dialogsService.getMessages(Number(req.params.id), req.query);
                if (result) {
                    this.ok(res, '', Object.assign({}, result));
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    createMessage({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!body.dialogId || !body.text) {
                    this.error(res, 400, 'Bad request');
                    return;
                }
                const result = yield this.dialogsService.createMessage(user.id, body.dialogId, body.text);
                if (result) {
                    this.ok(res, '', Object.assign({}, result));
                }
                else {
                    this.error(res, 400, 'Dialog not exist');
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
    deleteMessage({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!body.dialogId || !body.messageId) {
                    this.error(res, 400, 'Bad request');
                    return;
                }
                const result = yield this.dialogsService.deleteMessage(Number(body.dialogId), Number(body.messageId));
                if (result) {
                    this.ok(res, '', { message: 'success' });
                }
                else {
                    this.error(res, 400, { message: 'unsuccess' });
                }
            }
            catch (error) {
                this.error(res, 500, 'server side error');
            }
        });
    }
};
exports.DialogsController = DialogsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DialogsService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], DialogsController);
//# sourceMappingURL=dialogs.controller.js.map