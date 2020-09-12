"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Req = void 0;
const underscore_1 = __importDefault(require("underscore"));
// tslint:disable-next-line: no-namespace
var Req;
(function (Req) {
    Req.ParseParamType = {
        Any: () => true,
        String: (x) => underscore_1.default.isString(x),
        Number: (x) => underscore_1.default.isNumber(x),
        Object: (x) => underscore_1.default.isObject(x),
    };
    function parseParam(req, paramObj) {
        const ret = {};
        if (!underscore_1.default.isObject(paramObj)) {
            return false;
        }
        const data = (req.method === "GET") ? req.query : req.body;
        for (const param of Object.keys(paramObj)) {
            const c = data[param];
            // tslint:disable-next-line: ban-types
            const f = paramObj[param];
            if (!f(c)) {
                return false;
            }
            ret[param] = data[param];
        }
        return ret;
    }
    Req.parseParam = parseParam;
})(Req = exports.Req || (exports.Req = {}));
//# sourceMappingURL=req.js.map