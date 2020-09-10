import express, { json } from 'express';
import Backend from '../modules/backend';
import TedisInst from '../instances/tedisInst';


export default class AuthController{

    private responseError(res:express.Response, err:any, msg?:string){
        console.log( err instanceof Error ? err.stack : err);
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,401);
    }


    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            Backend.Response.success(res,{});
        }catch(err){
            return this.responseError(res,err);
        }
    }

    public async logIn(req:express.Request, res:express.Response):Promise<void>{
        try{
            Backend.Response.success(res,{});
        }catch(err){
            return this.responseError(res,err);
        }
    }



}

