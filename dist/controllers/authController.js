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
const backend_1 = __importDefault(require("../modules/backend"));
const mongoInst_1 = __importDefault(require("../instances/mongoInst"));
const auth_1 = __importDefault(require("../modules/auth"));
// TODO Request的Account還沒加入 & 密碼也要加上
class AuthController {
    responseError(res, err, msg) {
        console.log(err instanceof Error ? err.stack : err);
        return backend_1.default.Response.error(res, backend_1.default.Response.Status.FailureExecuting, msg, 401);
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    account: req.body.account,
                    pw: "",
                    joinT: Date.now().exFloorTimeToSec().toString()
                };
                yield mongoInst_1.default.roloUsers.insertOne(user);
                const token = auth_1.default.generateToken(user.account);
                backend_1.default.Response.success(res, token);
            }
            catch (err) {
                return this.responseError(res, err);
            }
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = auth_1.default.generateToken(req.body.account);
                backend_1.default.Response.success(res, token);
            }
            catch (err) {
                return this.responseError(res, err);
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map