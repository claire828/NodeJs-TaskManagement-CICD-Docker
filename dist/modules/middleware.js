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
        console.log(`【${req.method}】path:【${req === null || req === void 0 ? void 0 : req.path}】, \n body:【${JSON.stringify(req === null || req === void 0 ? void 0 : req.body) || "{}"}】`);
        next();
    }
    Middleware.log = log;
    function noCahce(req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    }
    Middleware.noCahce = noCahce;
    function verifyPostBody(req, res, next) {
        if (!_.isObject(req.body) || _.isEmpty(req.body)) {
            return backend_1.default.Response.error(res, backend_1.default.Response.Status.InsufficientParameters, 'Empty POST', 201);
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
    function verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bLegle = yield auth_1.default.isTokenLegal(req.body.token);
                if (!bLegle)
                    return backend_1.default.Response.verifyError(res);
                next();
            }
            catch (err) {
                return this.errorHandler(backend_1.default.Response.Status.FailureExecuting, 400);
            }
        });
    }
    Middleware.verifyToken = verifyToken;
    function verifyEmptyMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bLegle = yield auth_1.default.isRegistLegal(req.body.account);
                if (!bLegle)
                    return backend_1.default.Response.verifyError(res);
                next();
            }
            catch (err) {
                return this.errorHandler(backend_1.default.Response.Status.FailureExecuting, 400);
            }
        });
    }
    Middleware.verifyEmptyMember = verifyEmptyMember;
    function verifyAuthEntre(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bLegle = yield auth_1.default.isUserExist(req.body.account);
                if (!bLegle)
                    return backend_1.default.Response.verifyError(res);
                next();
            }
            catch (err) {
                return this.errorHandler(backend_1.default.Response.Status.FailureExecuting, 400);
            }
        });
    }
    Middleware.verifyAuthEntre = verifyAuthEntre;
})(Middleware || (Middleware = {}));
exports.default = Middleware;
//# sourceMappingURL=middleware.js.map