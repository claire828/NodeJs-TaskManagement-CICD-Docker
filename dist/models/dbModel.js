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
const tedisInst_1 = __importDefault(require("../instances/tedisInst"));
class DbModel {
    get db() { return tedisInst_1.default.get(); }
    retrieveByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield this.db.get(key);
            return (oldCache === null || oldCache === void 0 ? void 0 : oldCache.toString()) || null;
        });
    }
    generateTaskID(account) {
        return `${account}${Date.now().exToSec()}`;
    }
}
exports.default = DbModel;
//# sourceMappingURL=dbModel.js.map