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
exports.DialogsServices = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
let DialogsServices = exports.DialogsServices = class DialogsServices {
    constructor(dialogsRepository, usersRepository) {
        this.dialogsRepository = dialogsRepository;
        this.usersRepository = usersRepository;
    }
    createDialog(currentUserId, idOfNextMember) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextMember = yield this.usersRepository.find({ id: idOfNextMember });
            if (!nextMember)
                return null;
            const currentUser = yield this.usersRepository.find({ id: currentUserId });
            if (!currentUser)
                return null;
            const dialog = yield this.dialogsRepository.createDialog(`${currentUserId},${idOfNextMember}`);
            const users = [currentUser, nextMember];
            for (const user of users) {
                let dialogs = (user === null || user === void 0 ? void 0 : user.dialogs) && typeof user.dialogs === 'string' ? user.dialogs : '';
                if (dialogs.length) {
                    dialogs += ',' + dialog.id;
                }
                else {
                    dialogs += dialog.id;
                }
                yield this.usersRepository.updateDialogs(user.id, dialogs);
            }
            return dialog;
        });
    }
    deleteDialog(dialogId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dialogsRepository.deleteMessages(dialogId);
            const dialog = yield this.dialogsRepository.deleteDialog(dialogId);
            const membersArray = dialog.members && dialog.members.split(',').filter(i => i != '');
            if (Array.isArray(membersArray) && membersArray.length) {
                for (const id of membersArray) {
                    const user = yield this.usersRepository.find({ id: Number(id) });
                    if (user) {
                        const dialogs = user.dialogs && user.dialogs.split(',').filter(i => i != '').filter(id => Number(id) !== dialog.id) || [];
                        let sub = dialogs.join(',');
                        let updatedDialogs = sub ? sub : '';
                        yield this.usersRepository.updateDialogs(user.id, updatedDialogs);
                    }
                }
            }
            if (dialog) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    getDialogs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.usersRepository.find({ id: userId });
            const dialogsArray = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dialogs) && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dialogs.split(',').filter(i => i != ''));
            if (Array.isArray(dialogsArray) && dialogsArray.length) {
                const dialogs = [];
                for (const dialogId of dialogsArray) {
                    let dialog = yield this.dialogsRepository.getDialog(Number(dialogId));
                    if (dialog) {
                        dialogs.push(dialog);
                    }
                }
                return dialogs;
            }
            else {
                return null;
            }
        });
    }
    addUserToDialog(dialogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.find({ id: userId });
            const dialog = yield this.dialogsRepository.getDialog(dialogId);
            if (!user || !dialog)
                return null;
            const userDialogsArray = user.dialogs && user.dialogs.length ? user.dialogs.split(',') : [];
            if (userDialogsArray.includes(String(dialogId)))
                return dialog;
            userDialogsArray.push(String(dialogId));
            const dialogMembersArray = dialog.members.split(',');
            if (dialogMembersArray.includes(String(userId)))
                return dialog;
            dialogMembersArray.push(String(userId));
            yield this.usersRepository.updateDialogs(userId, userDialogsArray.join(','));
            return yield this.dialogsRepository.updateDialog(dialogId, dialogMembersArray.join(','));
        });
    }
    removeUserFromDialog(dialogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.find({ id: userId });
            const dialog = yield this.dialogsRepository.getDialog(dialogId);
            if (!user || !dialog)
                return null;
            let userDialogsArray = user.dialogs && user.dialogs.length ? user.dialogs.split(',') : [];
            if (!userDialogsArray.includes(String(dialogId)))
                return null;
            userDialogsArray = userDialogsArray.filter(id => Number(id) != dialogId);
            let dialogMembersArray = dialog.members.split(',');
            if (!dialogMembersArray.includes(String(userId)))
                return null;
            dialogMembersArray = dialogMembersArray.filter(id => Number(id) != userId);
            yield this.usersRepository.updateDialogs(userId, userDialogsArray.join(','));
            return yield this.dialogsRepository.updateDialog(dialogId, dialogMembersArray.join(','));
        });
    }
    createMessage(userId, dialogId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = yield this.dialogsRepository.getDialog(dialogId);
            if (!dialog)
                return null;
            return this.dialogsRepository.createMessage(userId, dialogId, text);
        });
    }
    deleteMessage(dialogId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dialogsRepository.deleteMessage(dialogId, messageId);
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    getMessages(dialogId, queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.dialogsRepository.countMessages(dialogId);
            const messages = yield this.dialogsRepository.getMessages(dialogId, queries.count ? Number(queries.count) : null, queries.page ? Number(queries.page) : null);
            if (count && messages) {
                return {
                    items: messages,
                    totalCount: count
                };
            }
            return {
                items: [],
                totalCount: 0
            };
        });
    }
};
exports.DialogsServices = DialogsServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DialogsRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UsersRepository)),
    __metadata("design:paramtypes", [Object, Object])
], DialogsServices);
//# sourceMappingURL=dialogs.service.js.map