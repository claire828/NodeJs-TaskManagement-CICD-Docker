import express from 'express';
import * as _ from "underscore";
import Backend from './backend';

// tslint:disable-next-line: no-namespace
namespace System {


    export namespace Middleware {
         export function verifyPostBody(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log(`[middleware]method:${req.method}, path:${req.path}, body:${JSON.stringify(req.body)}`)
            if (!_.isObject(req.body) || _.isEmpty(req.body)) {
                Backend.Response.error(res, Backend.Response.ErrorCode.InsufficientParameters, "Empty POST");
                return;
            }
            next();
        }

        export function addCorsHeader(req: express.Request, res: express.Response, next: express.NextFunction): void {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
            next();
        }

        export function errorHandler(err:Backend.Response.ErrorCode, msg:string) {
            return `Error Type:${Backend.Response.ErrorCode}, msg:${msg}`;
        }

    }


    export namespace Res {
        export interface ISuccess<T> {
            success: T;
        }

        export interface IError<T, K> {
            error: {
                no: Backend.Response.ErrorCode | K;
                msg?: string
                data?: T
            }
        }

        /**
         * 回應包裝
         */
        export function Success<T>(data: T): ISuccess<T> {
            return {
                success: data
            };
        }

        export function Error<T, K>(no: Backend.Response.ErrorCode | K, msg?: string, data?: T): IError<T, K> {
            return {
                error: {
                    no,
                    msg,
                    data
                }
            };
        }

    }

}


export default System;


