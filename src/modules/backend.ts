
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
        export enum Status {
            Success = 0,
            InsufficientParameters = 1,
            FailureExecuting = 2,
            DBError = 11,
            Token = 12,
            Verify = 13,
        }
        export interface ServerResponceContent {
            status: Status;
            message: string;
            data?: object;
        }

        // tslint:disable-next-line: no-shadowed-variable
        function generateResponse(status:Status, message:string, data?: object):ServerResponceContent{
            return {
                status,
                message,
                data
            }
        }

        export function error(res: express.Response, code: Status | number, msg: string, status:number): void {
            console.log(`[Req:${JSON.stringify(res?.req.route.path || "")}] fail code:${code}, msg:${msg}`);
            const responseInfo:ServerResponceContent = generateResponse(code, msg)
            res.status(status).send(responseInfo);
        }

        export function success<T extends object>(res: express.Response, data: T): void {
            console.log(`[Req:${JSON.stringify(res?.req.route.path || "")}] success data:${JSON.stringify(data)}`);
            res.send(generateResponse(Status.Success, '',data));
        }
    }
}
export default Backend;