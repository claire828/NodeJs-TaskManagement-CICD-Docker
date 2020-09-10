import express from 'express';
import * as _ from "underscore";
import Backend from './backend';
import Auth from './auth';

// tslint:disable-next-line: no-namespace
namespace Middleware {

    export function log(req: express.Request, res: express.Response, next: express.NextFunction){
        console.log(`【${req.method}】path:【${req.path}】, \n body:【${JSON.stringify(req.body)}】`);
        next();
    }

    export function verifyPostBody(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!_.isObject(req.body) || _.isEmpty(req.body)) {
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

    /*
     * 驗證（不理會帳號是否存在，提供給註冊的要求使用）
     */
    export function verifyOnlyAuthorize(req:express.Request, res:express.Response, next:express.NextFunction){
        const bSuccess = Auth.VerifyToken(req);
        if(!bSuccess) return Backend.Response.verifyError(res);
        next();
    }

    /**
     * 驗證＋帳號合法性
     */
    export function verifyAuthAndMember(req:express.Request, res:express.Response, next:express.NextFunction){
        const user:string ="";
        const bAuth = Auth.VerifyToken(req);
        const bUser = Auth.IsUserExist(user);
        if(!bUser || !bAuth) return Backend.Response.verifyError(res);
        next();
    }
}


export default Middleware;


