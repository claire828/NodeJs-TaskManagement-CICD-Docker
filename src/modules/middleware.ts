import express from 'express';
import * as _ from "underscore";
import Backend from './backend';

// tslint:disable-next-line: no-namespace
namespace Middleware {

        export function verifyPostBody(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log(`[middleware]method:${req.method}, path:${req.path}, body:${JSON.stringify(req.body)}`)
            if (!_.isObject(req.body) || _.isEmpty(req.body)) {
                console.log("[middleware] post 沒過  return");
                return Backend.Response.error(res, Backend.Response.Status.InsufficientParameters, 'Empty POST',200);
            }
            next();
        }

        export function addCorsHeader(req: express.Request, res: express.Response, next: express.NextFunction){
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
            next();
        }

        export function errorHandler(err:Backend.Response.Status, msg:string) {
            return `Error Type:${Backend.Response.Status}, msg:${msg}`;
        }

        export function unknownRoute(req: express.Request, res: express.Response, next: express.NextFunction): void {
            return res.status(403).end();
        }
        export function verifyAuthorize(req:express.Request, res:express.Response, next:express.NextFunction){
            // TODO HMAC解密實作
            next();
        }
}


export default Middleware;


