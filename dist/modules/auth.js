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
const token_1 = require("./token");
// tslint:disable-next-line: no-namespace
var Auth;
(function (Auth) {
    const TOKEN_VALIDITY = 600;
    function isTokenLegal(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoToken = token_1.LoginToken.decode(token);
            console.log(`decodeToken:${JSON.stringify(infoToken)}`);
            const validTime = (TOKEN_VALIDITY + Date.now().exFloorTimeToSec());
            if (!infoToken || !infoToken.account || !infoToken.expire || infoToken.expire > validTime) {
                return false;
            }
            return true;
        });
    }
    Auth.isTokenLegal = isTokenLegal;
    function generateToken(account) {
        const time = Date.now().exFloorTimeToSec();
        const token = token_1.LoginToken.encode({
            account,
            t: time,
            expire: time + TOKEN_VALIDITY
        });
        return token;
    }
    Auth.generateToken = generateToken;
})(Auth || (Auth = {}));
exports.default = Auth;
//# sourceMappingURL=auth.js.map