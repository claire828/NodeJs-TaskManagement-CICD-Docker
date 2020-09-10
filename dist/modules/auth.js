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
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-namespace
var Auth;
(function (Auth) {
    function VerifyToken(req) {
        // TODO HMAC解密實作
        /*const secret = 'abcdefg';
        const hash = crypto.createHmac('sha256', secret)
                        .update('I love cupcakes')
                        .digest('hex');
        console.log(`驗證:${hash}`);*/
        return true;
    }
    Auth.VerifyToken = VerifyToken;
    function GenerateToken(user) {
        console.log("產出token");
    }
    Auth.GenerateToken = GenerateToken;
    function IsUserExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    Auth.IsUserExist = IsUserExist;
})(Auth || (Auth = {}));
exports.default = Auth;
//# sourceMappingURL=auth.js.map