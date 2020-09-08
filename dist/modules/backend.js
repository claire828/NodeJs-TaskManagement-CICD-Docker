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
        Req.ParseParamType = {
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
        /* export function parseParam2(req:express.Request, paramObj:Record< any,(x:string|number|object|any)=>boolean>):Record<string,any> | boolean{
             const mapping: Record<string,any> = {};
             Object.keys(paramObj).forEach((key,value)=>{
                 console.log(key);
                // if(!value) return false;
                // mapping[key] = req.body[key];
                 mapping[key] = "claire";
             });
             return mapping;
         }
 
         export function test<T extends object>(req:express.Request, inter:T):boolean| T{
             const mapping = inter;
             console.log(`inter:${JSON.stringify(inter)}`);
             console.log(`mapping:${JSON.stringify(mapping)}`);
             Object.keys(inter).forEach((key,value)=>{
                 const hey = {[key]:"claire"};
                 // if(!value) return false;
                 // mapping = Object.assign({key:req.body[key]},mapping);
                 const hello = Object.assign(hey,mapping);
                 console.log(`hello:${JSON.stringify(hello)}`);
                 return hello;
             });
             return mapping;
         }*/
    })(Req = Backend.Req || (Backend.Req = {}));
    let Response;
    (function (Response) {
        let ErrorCode;
        (function (ErrorCode) {
            /** 請求結果成功 */
            ErrorCode[ErrorCode["Success"] = 0] = "Success";
            /** 必要請求參數不足或異常 */
            ErrorCode[ErrorCode["InsufficientParameters"] = 1] = "InsufficientParameters";
            /** 執行過程發生其他異常 */
            ErrorCode[ErrorCode["FailureExecuting"] = 9] = "FailureExecuting";
            /** 系統維護中 */
            ErrorCode[ErrorCode["UnderMaintenance"] = 10] = "UnderMaintenance";
            /** DB Error */
            ErrorCode[ErrorCode["DBError"] = 11] = "DBError";
            /** Token error */
            ErrorCode[ErrorCode["Token"] = 12] = "Token";
            /** Verify error */
            ErrorCode[ErrorCode["Verify"] = 13] = "Verify";
        })(ErrorCode = Response.ErrorCode || (Response.ErrorCode = {}));
        // tslint:disable-next-line: no-shadowed-variable
        function generateResponse(ErrorCode, Message, Data) {
            return {
                ErrorCode,
                Message,
                Data
            };
        }
        function error(res, code, msg, status = 200) {
            console.log(`[Req]fail code:${code}, msg:${msg}`);
            res.status(status).send(generateResponse(code, msg, {}));
        }
        Response.error = error;
        function success(res, data) {
            console.log(`[Req]success data:${JSON.stringify(data)}`);
            res.send(generateResponse(ErrorCode.Success, '', data));
        }
        Response.success = success;
    })(Response = Backend.Response || (Backend.Response = {}));
})(Backend || (Backend = {}));
exports.default = Backend;
//# sourceMappingURL=backend.js.map