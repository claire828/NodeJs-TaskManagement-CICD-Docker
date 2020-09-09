import express from 'express';
import * as _ from "underscore";
import Backend from './backend';

// tslint:disable-next-line: no-namespace
namespace System {

    export namespace Middleware {
        export function verifyPostBody(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log(`[middleware]method:${req.method}, path:${req.path}, body:${JSON.stringify(req.body)}`)
            if (!_.isObject(req.body) || _.isEmpty(req.body)) {
                console.log("[middleware] post 沒過  return掉");
                return Backend.Response.error(res, Backend.Response.ErrorCode.InsufficientParameters, 'Empty POST',200);
            }
            next();
        }

        export function addCorsHeader(req: express.Request, res: express.Response, next: express.NextFunction){
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
            next();
        }

        export function errorHandler(err:Backend.Response.ErrorCode, msg:string) {
            return `Error Type:${Backend.Response.ErrorCode}, msg:${msg}`;
        }

        export function verifyAuthorize(req:express.Request, res:express.Response, next:express.NextFunction){
            // TODO HMAC解密實作
            next();
        }
    }


    export namespace Res {
        export type SuccessStruct<T> ={
            success: T;
        }

        export type ErrorStruct<T, K> = {
            error: {
                status: Backend.Response.ErrorCode | K;
                msg?: string
                data?: T
            }
        }

        export function success<T>(data: T): SuccessStruct<T> {
            return {
                success: data
            };
        }

        export function error<T, K>(status: Backend.Response.ErrorCode | K, msg?: string, data?: T): ErrorStruct<T, K> {
            return {
                error: {
                    status,
                    msg,
                    data
                }
            };
        }

    }

}


export default System;


