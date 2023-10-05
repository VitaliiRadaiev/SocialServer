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
exports.ProfileServices = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const path_1 = require("path");
const jimp_1 = __importDefault(require("jimp"));
const types_1 = require("../types");
const class_validator_1 = require("class-validator");
let ProfileServices = exports.ProfileServices = class ProfileServices {
    constructor(profileRepository, configService) {
        this.profileRepository = profileRepository;
        this.configService = configService;
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.profileRepository.find(id);
        });
    }
    updateProfile(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = {};
            if ((0, class_validator_1.isBoolean)(newData.lookingForAJob))
                profile.lookingForAJob = newData.lookingForAJob;
            if (newData.lookingForAJobDescription)
                profile.lookingForAJobDescription = newData.lookingForAJobDescription;
            if (newData.login)
                profile.login = newData.login;
            if (newData.fullName)
                profile.fullName = newData.fullName;
            if (newData.status)
                profile.status = newData.status;
            let resultOfProfileUpdate = yield this.profileRepository.updateProfile(id, profile);
            if (!resultOfProfileUpdate)
                return null;
            if (typeof newData.contacts === 'object') {
                const contacts = {};
                if (typeof newData.contacts.github === 'string')
                    contacts.github = newData.contacts.github;
                if (typeof newData.contacts.facebook === 'string')
                    contacts.facebook = newData.contacts.facebook;
                if (typeof newData.contacts.instagram === 'string')
                    contacts.instagram = newData.contacts.instagram;
                if (typeof newData.contacts.twitter === 'string')
                    contacts.twitter = newData.contacts.twitter;
                if (typeof newData.contacts.website === 'string')
                    contacts.website = newData.contacts.website;
                if (typeof newData.contacts.youtube === 'string')
                    contacts.youtube = newData.contacts.youtube;
                if (typeof newData.contacts.mainLink === 'string')
                    contacts.mainLink = newData.contacts.mainLink;
                let resultOfContactsUpdate = yield this.profileRepository.updateContacts(id, contacts);
                if (!resultOfContactsUpdate)
                    return null;
            }
            return this.profileRepository.find(id);
        });
    }
    setPhoto(id, fileArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const [file] = Array.from(Object.values(fileArray));
            if (Array.isArray(file))
                return null;
            file.mv((0, path_1.join)(__dirname, '../public/images/', `userId=${id}_large${(0, path_1.extname)(file.name)}`))
                .then(() => {
                jimp_1.default.read((0, path_1.join)(__dirname, '../public/images/', `userId=${id}_large${(0, path_1.extname)(file.name)}`), (err, img) => {
                    if (err)
                        throw err;
                    img
                        .cover(768, 480).quality(100)
                        .write((0, path_1.join)(__dirname, '../public/images/', `userId=${id}_large${(0, path_1.extname)(file.name)}`))
                        .cover(256, 256).quality(100)
                        .write((0, path_1.join)(__dirname, '../public/images/', `userId=${id}_small${(0, path_1.extname)(file.name)}`));
                });
            });
            return this.profileRepository.updatePhotos(id, {
                large: `${this.configService.get('HOST')}/images/userId=${id}_large${(0, path_1.extname)(file.name)}`,
                small: `${this.configService.get('HOST')}/images/userId=${id}_small${(0, path_1.extname)(file.name)}`,
            });
        });
    }
};
exports.ProfileServices = ProfileServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ProfileRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, Object])
], ProfileServices);
//# sourceMappingURL=profile.services.js.map