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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketController = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const node_url_1 = __importDefault(require("node:url"));
const jsonwebtoken_1 = require("jsonwebtoken");
let WebsocketController = exports.WebsocketController = class WebsocketController {
    constructor(configService, dialogsService, dialogsRepository) {
        this.configService = configService;
        this.dialogsService = dialogsService;
        this.dialogsRepository = dialogsRepository;
        this._clients = {};
    }
    get handler() {
        return this.initHandler();
    }
    initHandler() {
        return (ws, req) => {
            const token = node_url_1.default.parse(req.url, true).query.token;
            if (!token) {
                console.log(`Client has closed`);
                ws.close();
                return;
            }
            const jwtVerify = () => {
                try {
                    return (0, jsonwebtoken_1.verify)(token, this.configService.get('SECRET'));
                }
                catch (_a) {
                    return null;
                }
            };
            const userData = jwtVerify();
            if (!userData) {
                console.log(`Client has closed`);
                ws.close();
                return;
            }
            console.log('Client has conected');
            this._clients[userData.id] = ws;
            ws.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
                const message = JSON.parse(data.toString());
                const createdMessage = yield this.dialogsService.createMessage(userData.id, Number(message.dialogId), message.text);
                if (createdMessage) {
                    const dialog = yield this.dialogsRepository.getDialog(Number(message.dialogId));
                    if (dialog) {
                        const members = dialog.members.split(',');
                        for (const id of members) {
                            if (this._clients[id]) {
                                this._clients[id].send(JSON.stringify(createdMessage));
                            }
                        }
                    }
                }
            }));
            ws.on('close', () => {
                console.log('close slient');
                delete this._clients[userData.id];
            });
        };
    }
};
exports.WebsocketController = WebsocketController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DialogsService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.DialogsRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], WebsocketController);
//# sourceMappingURL=websocket.controller.js.map