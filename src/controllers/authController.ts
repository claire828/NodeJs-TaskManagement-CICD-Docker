import express from 'express';
import Backend from '../modules/backend';
import AuthModel from '../models/authModel';
import _ from 'underscore';
import { LoginToken } from '../modules/token';

export default class AuthController{

    private responseError(res:express.Response, err:any, msg?:string){
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,401);
    }

    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            const account = req.body.account;
            const pw = req.body.pw;
            let status = Backend.Response.Status.InsufficientParameters;
            if(!_.isEmpty(account) && _.isString(account) && !_.isEmpty(pw) && _.isString(pw)){
                 status = await AuthModel.register(account,pw);
                if(status === Backend.Response.Status.Success){
                    return Backend.Response.success(res, {});
                }
            }
            return Backend.Response.error(res,1,"",status);
        }catch(err){
            return this.responseError(res,err);
        }
    }

    public async logIn(req:express.Request, res:express.Response):Promise<void>{
        try{
            // TODO 使用帳密登入 或 TOKEN
            const token = LoginToken.generateToken(req.body.account);
            Backend.Response.success(res,{token});
        }catch(err){
            return this.responseError(res,err);
        }
    }



}

