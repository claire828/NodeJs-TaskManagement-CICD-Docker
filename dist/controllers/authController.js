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
    register(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [account, pw] = [(_a = req.body) === null || _a === void 0 ? void 0 : _a.account, (_b = req.body) === null || _b === void 0 ? void 0 : _b.pw];
                let status = backend_1.default.Status.InsufficientParams;
                if (!underscore_1.default.isEmpty(account) && underscore_1.default.isString(account) && !underscore_1.default.isEmpty(pw) && underscore_1.default.isString(pw)) {
                    status = yield authModel_1.default.registerUser(account, pw);
                    if (status === backend_1.default.Status.Success) {
                        return backend_1.default.success(res, {});
                    }
                    return backend_1.default.error(res, status, "Register Failed", 400);
                }
                return backend_1.default.error(res, status, "InsufficientParams", 400);
            }
            catch (err) {
                console.log("ERRR");
            }
        });
    }
    logIn(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [account, pw] = [(_a = req.body) === null || _a === void 0 ? void 0 : _a.account, (_b = req.body) === null || _b === void 0 ? void 0 : _b.pw];
                if (!underscore_1.default.isEmpty(account) && underscore_1.default.isString(account) && !underscore_1.default.isEmpty(pw) && underscore_1.default.isString(pw)) {
                    if (yield authModel_1.default.isUserMath(account, pw)) {
                        const token = token_1.LoginToken.generateToken(req.body.account);
                        return backend_1.default.success(res, { token });
                    }
                    return backend_1.default.error(res, backend_1.default.Status.Verify, "login Failed", 400);
                }
                return backend_1.default.error(res, backend_1.default.Status.InsufficientParams, "InsufficientParams", 400);
            }
            catch (err) {
                console.log("ERRR");
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map