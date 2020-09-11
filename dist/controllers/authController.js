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
const authModel_1 = __importDefault(require("../models/authModel"));
const underscore_1 = __importDefault(require("underscore"));
const token_1 = require("../modules/token");
class AuthController {
    responseError(res, err, msg) {
        return backend_1.default.Response.error(res, backend_1.default.Response.Status.FailureExecuting, msg, 401);
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = req.body.account;
                const pw = req.body.pw;
                let status = backend_1.default.Response.Status.InsufficientParameters;
                if (!underscore_1.default.isEmpty(account) && underscore_1.default.isString(account) && !underscore_1.default.isEmpty(pw) && underscore_1.default.isString(pw)) {
                    status = yield authModel_1.default.register(account, pw);
                    if (status === backend_1.default.Response.Status.Success) {
                        return backend_1.default.Response.success(res, {});
                    }
                }
                return backend_1.default.Response.error(res, 1, "", status);
            }
            catch (err) {
                return this.responseError(res, err);
            }
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO 使用帳密登入 或 TOKEN
                const token = token_1.LoginToken.generateToken(req.body.account);
                backend_1.default.Response.success(res, { token });
            }
            catch (err) {
                return this.responseError(res, err);
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map