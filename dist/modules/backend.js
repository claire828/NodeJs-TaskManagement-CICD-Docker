"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = __importDefault(require("underscore"));
// tslint:disable-next-line: no-namespace
var Backend;
(function (Backend) {
    let Req;
    (function (Req) {
        Req.PARSEPARAMTYPE = {
            Any: () => true,
            String: (x) => underscore_1.default.isString(x),
            Number: (x) => underscore_1.default.isNumber(x),
            // tslint:disable-next-line: ban-types
            Object: (x) => underscore_1.default.isObject(x),
        };
        function parseParam(req, paramObj) {
            const mapping = new Map();
            Object.keys(paramObj).forEach((key, inx) => {
                const value = req.body[key];
                // console.log(`validation key:${key}, paramObj[key]:${paramObj[key](value)}`);
                if (!paramObj[key])
                    return false;
                mapping.set(key, value);
            });
            return mapping;
        }
        Req.parseParam = parseParam;
    })(Req = Backend.Req || (Backend.Req = {}));
    let Response;
    (function (Response) {
        let Status;
        (function (Status) {
            Status[Status["Success"] = 0] = "Success";
            Status[Status["InsufficientParameters"] = 1] = "InsufficientParameters";
            Status[Status["FailureExecuting"] = 2] = "FailureExecuting";
            Status[Status["DBError"] = 11] = "DBError";
            Status[Status["Token"] = 12] = "Token";
            Status[Status["Verify"] = 13] = "Verify";
        })(Status = Response.Status || (Response.Status = {}));
        // tslint:disable-next-line: no-shadowed-variable
        function generateResponse(status, message, data) {
            return {
                status,
                message,
                data
            };
        }
        function error(res, code, msg, status) {
            console.log(`[Req:${JSON.stringify((res === null || res === void 0 ? void 0 : res.req.route.path) || "")}] fail code:${code}, msg:${msg}`);
            const responseInfo = generateResponse(code, msg);
            res.status(status).send(responseInfo).end();
        }
        Response.error = error;
        function success(res, data) {
            console.log(`[Req:${JSON.stringify((res === null || res === void 0 ? void 0 : res.req.route.path) || "")}] success data:${JSON.stringify(data)}`);
            res.send(generateResponse(Status.Success, '', data));
        }
        Response.success = success;
        function verifyError(res) {
            error(res, Status.Verify, "invalid client", 401);
        }
        Response.verifyError = verifyError;
        function requestError(res) {
            error(res, Status.InsufficientParameters, "invalid request", 400);
        }
        Response.requestError = requestError;
    })(Response = Backend.Response || (Backend.Response = {}));
})(Backend || (Backend = {}));
exports.default = Backend;
//# sourceMappingURL=backend.js.map