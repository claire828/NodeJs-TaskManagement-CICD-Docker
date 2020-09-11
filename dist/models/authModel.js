"use strict";
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
const mongoInst_1 = __importDefault(require("../instances/mongoInst"));
require("../extensions/numberExtension");
require("../extensions/arrayExtension");
require("../extensions/stringExtension");
const backend_1 = __importDefault(require("../modules/backend"));
class AuthModel {
    static register(account, pw, secreat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAllow = yield this.validateRegist(account);
                if (isAllow) {
                    const user = {
                        account,
                        pw,
                        joinT: Date.now().exFloorTimeToSec().toString()
                    };
                    mongoInst_1.default.roloUsers.insertOne(user);
                    return backend_1.default.Response.Status.Success;
                }
                return backend_1.default.Response.Status.Verify;
            }
            catch (err) {
                return backend_1.default.Response.Status.DBError;
            }
        });
    }
    static validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    static validateRegist(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const bValidation = this.validateEmail(account);
            if (bValidation) {
                return !(yield this.isUserExist(account));
            }
            return false;
        });
    }
    static isUserExist(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoInst_1.default.roloUsers.findOne({ account });
            return result;
        });
    }
}
exports.default = AuthModel;
//# sourceMappingURL=authModel.js.map