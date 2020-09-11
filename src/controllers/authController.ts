import express from 'express';
import Backend from '../modules/backend';
import Auth from '../modules/auth';
import AuthModel from '../models/authModel';

export default class AuthController{

    private responseError(res:express.Response, err:any, msg?:string){
        console.log( err instanceof Error ? err.stack : err);
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,401);
    }

    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            const status = await AuthModel.register(req.body.account);
            if(status === Backend.Response.Status.Success){
                const token = Auth.generateToken(req.body.account);
                return Backend.Response.success(res,token);
            }
            return Backend.Response.error(res,1,"",status);
        }catch(err){
            return this.responseError(res,err);
        }
    }

    public async logIn(req:express.Request, res:express.Response):Promise<void>{
        try{
            const token = Auth.generateToken(req.body.account);
            Backend.Response.success(res,token);
        }catch(err){
            return this.responseError(res,err);
        }
    }



}

