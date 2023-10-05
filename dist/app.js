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
exports.App = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const ws_1 = require("ws");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const types_1 = require("./types");
const users_controller_1 = require("./users/users.controller");
const prisma_service_1 = require("./database/prisma.service");
const profile_controller_1 = require("./profile/profile.controller");
const follow_controller_1 = require("./follow/follow.controller");
const websocket_controller_1 = require("./websocket/websocket.controller");
const dialogs_controller_1 = require("./dialogs/dialogs.controller");
let App = exports.App = class App {
    constructor(logger, exeptionFilter, prismaService, usersController, profileController, followController, websocketController, dialogsController) {
        this.logger = logger;
        this.exeptionFilter = exeptionFilter;
        this.prismaService = prismaService;
        this.usersController = usersController;
        this.profileController = profileController;
        this.followController = followController;
        this.websocketController = websocketController;
        this.dialogsController = dialogsController;
        this.app = (0, express_1.default)();
        this.port = 8000;
        this.server = (0, http_1.createServer)(this.app);
        this.wss = new ws_1.WebSocketServer({ server: this.server, path: '/ws' });
        this.wsClients = {};
    }
    useMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use((0, express_fileupload_1.default)({}));
    }
    useRoutes() {
        this.app.use('/api/auth', this.usersController.router);
        this.app.use('/api/users', this.usersController.router);
        this.app.use('/api/profile', this.profileController.router);
        this.app.use('/api/follow', this.followController.router);
        this.app.use('/api/dialogs', this.dialogsController.router);
    }
    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }
    useWebsocket() {
        this.wss.on('connection', this.websocketController.handler);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddleware();
            this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
            this.useRoutes();
            this.useExeptionFilters();
            this.app.use((req, res, next) => {
                res.sendFile(path_1.default.join(path_1.default.join(__dirname, 'public', 'index.html')));
            });
            yield this.prismaService.connect();
            this.useWebsocket();
            this.server.listen(this.port);
            this.logger.log(`Server is running on http://localhost:${this.port}`);
        });
    }
};
exports.App = App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ExeptionFilter)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.UsersController)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ProfileController)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.FollowController)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.WebsocketController)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.DialogsController)),
    __metadata("design:paramtypes", [Object, Object, prisma_service_1.PrismaService,
        users_controller_1.UsersController,
        profile_controller_1.ProfileController,
        follow_controller_1.FollowController,
        websocket_controller_1.WebsocketController,
        dialogs_controller_1.DialogsController])
], App);
//# sourceMappingURL=app.js.map