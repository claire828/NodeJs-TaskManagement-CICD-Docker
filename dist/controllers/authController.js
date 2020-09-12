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
const token_1 = require("../modules/token");
const req_1 = require("../modules/req");
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = this.mappingAuthParam(req);
            if (!param)
                return backend_1.default.paramsError(res);
            try {
                const status = yield authModel_1.default.registerUser(param.account, param.pw);
                if (status === backend_1.default.Status.Success) {
                    return backend_1.default.success(res, {});
                }
                return backend_1.default.error(res, status, "Register Failed", 400);
            }
            catch (err) {
                console.log("ERRR");
            }
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = this.mappingAuthParam(req);
            if (!param)
                return backend_1.default.paramsError(res);
            try {
                if (yield authModel_1.default.isUserMath(param.account, param.pw)) {
                    const token = token_1.LoginToken.generateToken(req.body.account);
                    return backend_1.default.success(res, { token });
                }
                return backend_1.default.error(res, backend_1.default.Status.Verify, "login Failed", 400);
            }
            catch (err) {
                console.log("ERRR");
            }
        });
    }
    mappingAuthParam(req) {
        return req_1.Req.parsePostParam(req, {
            account: req_1.Req.ParseParamType.String,
            pw: req_1.Req.ParseParamType.String
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map