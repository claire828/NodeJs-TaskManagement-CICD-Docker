"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.LoginToken = exports.Token = void 0;
const Crypto = __importStar(require("crypto"));
class Token {
    constructor(secret) {
        this.TokenValidateSec = 600;
        this.EncodeType = 'base64';
        this.SaltRounds = 10;
        this.secret = undefined;
        this.secret = secret;
    }
    /**
     * Server創造Token -> send back to client
     * @param data
     */
    encode(data) {
        const dataBase64 = Buffer.from(JSON.stringify(data)).toString(this.EncodeType);
        return `${dataBase64}.${this.signature(dataBase64)}`;
    }
    /**
     * 登入, 解析Client的Token正確與否
     * @param encoded
     * @param salt
     */
    decode(encoded) {
        const strSplit = encoded.split('.');
        if (strSplit.length === 2) {
            const [dataBase64, hmac] = strSplit;
            const sig = this.signature(dataBase64);
            if (sig === hmac) {
                const result = Buffer.from(dataBase64, this.EncodeType).toString();
                return JSON.parse(result);
            }
        }
        return null;
    }
    signature(data) {
        return Crypto.createHmac('sha512', this.secret).update(data).digest(this.EncodeType);
    }
    generateToken(account) {
        const time = Date.now().exFloorTimeToSec();
        const token = exports.LoginToken.encode({
            account,
            t: time,
            expire: time + this.TokenValidateSec
        });
        return token;
    }
    isTokenLegal(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoToken = exports.LoginToken.decode(token);
            console.log(`decodeToken:${JSON.stringify(infoToken)}`);
            const validTime = (this.TokenValidateSec + Date.now().exFloorTimeToSec());
            if (!infoToken || !infoToken.account || !infoToken.expire || infoToken.expire > validTime) {
                return false;
            }
            return true;
        });
    }
}
exports.Token = Token;
;
const Secreat = 'LoginTokenMI(*()JMkdj-vi 1-o =24m mdpsai]- 12]j98dsua0[pj';
exports.LoginToken = new Token(Secreat);
exports.default = Token;
//# sourceMappingURL=token.js.map