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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("underscore"));
const backend_1 = __importDefault(require("./backend"));
const auth_1 = __importDefault(require("./auth"));
// tslint:disable-next-line: no-namespace
var Middleware;
(function (Middleware) {
    function log(req, res, next) {
        console.log(`【${req.method}】path:【${req.path}】, \n body:【${JSON.stringify(req.body)}】`);
        next();
    }
    Middleware.log = log;
    function verifyPostBody(req, res, next) {
        if (!_.isObject(req.body) || _.isEmpty(req.body)) {
            return backend_1.default.Response.error(res, backend_1.default.Response.Status.InsufficientParameters, 'Empty POST', 200);
        }
        next();
    }
    Middleware.verifyPostBody = verifyPostBody;
    function addCorsHeader(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
        next();
    }
    Middleware.addCorsHeader = addCorsHeader;
    function errorHandler(err, msg) {
        return `Error Type:${backend_1.default.Response.Status}, msg:${msg}`;
    }
    Middleware.errorHandler = errorHandler;
    function unknownRoute(req, res, next) {
        return res.status(403).end();
    }
    Middleware.unknownRoute = unknownRoute;
    /*
     * 驗證（不理會帳號是否存在，提供給註冊的要求使用）
     */
    function verifyOnlyAuthorize(req, res, next) {
        const bSuccess = auth_1.default.VerifyToken(req);
        if (!bSuccess)
            return backend_1.default.Response.verifyError(res);
        next();
    }
    Middleware.verifyOnlyAuthorize = verifyOnlyAuthorize;
    /**
     * 驗證＋帳號合法性
     */
    function verifyAuthAndMember(req, res, next) {
        const user = "";
        const bAuth = auth_1.default.VerifyToken(req);
        const bUser = auth_1.default.IsUserExist(user);
        if (!bUser || !bAuth)
            return backend_1.default.Response.verifyError(res);
        next();
    }
    Middleware.verifyAuthAndMember = verifyAuthAndMember;
})(Middleware || (Middleware = {}));
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map