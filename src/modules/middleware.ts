import express from 'express';
import * as _ from "underscore";
import Backend from './backend';
import Auth from './auth';

// tslint:disable-next-line: no-namespace
namespace Middleware {

    export function log(req: express.Request, res: express.Response, next: express.NextFunction){
        console.log(`【${req.method}】path:【${req?.path}】, \n body:【${JSON.stringify(req?.body) || "{}"}】`);
        next();
    }

    export function verifyPostBody(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!_.isObject(req.body) || _.isEmpty(req.body)) {
            return Backend.Response.error(res, Backend.Response.Status.InsufficientParameters, 'Empty POST',201);
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


     export async function verifyToken(req:express.Request, res:express.Response, next:express.NextFunction){
        try{
            const bLegle = await Auth.isTokenLegal(req.body.token);
            if(!bLegle) return Backend.Response.verifyError(res);
            next();
        }catch(err){
            return this.errorHandler(Backend.Response.Status.FailureExecuting,400);
        }
    }

    export async function verifyEmptyMember(req:express.Request, res:express.Response, next:express.NextFunction){
        try{
            const bLegle = await Auth.isRegistLegal(req.body.account);
            if(!bLegle) return Backend.Response.verifyError(res);
            next();
        }catch(err){
            return this.errorHandler(Backend.Response.Status.FailureExecuting,400);
        }
    }

    export async function verifyAuthEntre(req:express.Request, res:express.Response, next:express.NextFunction){
        try{
            const bLegle = await Auth.isUserExist(req.body.account);
            if(!bLegle) return Backend.Response.verifyError(res);
            next();
        }catch(err){
            return this.errorHandler(Backend.Response.Status.FailureExecuting,400);
        }
    }
}


export default Middleware;


