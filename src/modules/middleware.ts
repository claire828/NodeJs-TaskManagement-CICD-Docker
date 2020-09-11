import express from 'express';
import * as _ from "underscore";
import Backend from './backend';
import AuthModel from '../models/authModel';
import { LoginToken } from './token';

// tslint:disable-next-line: no-namespace
namespace Middleware {

    export function log(req: express.Request, res: express.Response, next: express.NextFunction){
        console.log(`【${req.method}】path:【${req?.path}】, \n body:【${JSON.stringify(req?.body) || "{}"}】`);
        next();
    }

    export function noCahce(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
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

    export function unknownRoute(req: express.Request, res: express.Response, next: express.NextFunction): void {
        return res.status(403).end();
    }

     export async function verifyToken(req:express.Request, res:express.Response, next:express.NextFunction){
        try{
            const toekn = req.body.token;
            if(!_.isEmpty(toekn) && _.isString(toekn)){
                const bLegle = await LoginToken.isTokenLegal(req.body.token);
                if(bLegle) return next();
            }
             Backend.Response.verifyError(res);
        }catch(err){
            return Backend.Response.verifyError(res);
        }
    }



}


export default Middleware;


