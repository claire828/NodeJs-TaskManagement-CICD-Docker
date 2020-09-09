
import express from 'express';
import _, { map, object } from 'underscore';

// tslint:disable-next-line: no-namespace
namespace Backend{

    export namespace Req{
        export const PARSEPARAMTYPE = {
            Any: () => true,
            String: (x: string) => _.isString(x),
            Number: (x: string) => _.isNumber(x),
            // tslint:disable-next-line: ban-types
            Object: (x: Object) => _.isObject(x),
        }

        export function parseParam(req:express.Request, paramObj:Record< any, (x:string|number|object|any)=>boolean>):Map<string,any> | boolean{
            const mapping: Map<string,any> = new Map();
            Object.keys(paramObj).forEach((key,inx)=>{
                const value = req.body[key];
                // console.log(`validation key:${key}, paramObj[key]:${paramObj[key](value)}`);
                if(!paramObj[key]) return false;
               mapping.set(key,value);
            });
            return mapping;
        }
    }

    export namespace Response{
        export enum ErrorCode {
            /** 請求結果成功 */
            Success = 0,
            /** 必要請求參數不足或異常 */
            InsufficientParameters = 1,
            /** 執行過程發生其他異常 */
            FailureExecuting = 9,
            /** 系統維護中 */
            UnderMaintenance = 10,
            /** DB Error */
            DBError = 11,
            /** Token error */
            Token = 12,
            /** Verify error */
            Verify = 13,
        }
        export interface ResStruct {
            ErrorCode: ErrorCode;
            Message: string;
            Data: object;
        }

        // tslint:disable-next-line: no-shadowed-variable
        function generateResponse(ErrorCode:ErrorCode, Message:string, Data: object):ResStruct{
            return {
                ErrorCode,
                Message,
                Data
            }
        }

        export function error(res: express.Response, code: ErrorCode | number, msg: string, status:number): void {
            console.log(`[Req]fail code:${code}, msg:${msg}`);
            res.status(status).send(generateResponse(code, msg,{}));
        }

        export function success<T extends object>(res: express.Response, data: T): void {
            console.log(`[Req]success data:${JSON.stringify(data)}`);
            res.send(generateResponse(ErrorCode.Success, '',data));
        }
    }
}
export default Backend;