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
// tslint:disable-next-line: no-namespace
var Middleware;
(function (Middleware) {
    function verifyPostBody(req, res, next) {
        console.log(`[middleware]method:${req.method}, path:${req.path}, body:${JSON.stringify(req.body)}`);
        if (!_.isObject(req.body) || _.isEmpty(req.body)) {
            console.log("[middleware] post 沒過  return");
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
    function verifyAuthorize(req, res, next) {
        // TODO HMAC解密實作
        next();
    }
    Middleware.verifyAuthorize = verifyAuthorize;
})(Middleware || (Middleware = {}));
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map