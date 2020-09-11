import express from 'express';
import Backend from '../modules/backend';
import AuthModel from '../models/authModel';
import _ from 'underscore';
import { LoginToken } from '../modules/token';

export default class AuthController{


    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            const account = req.body?.account;
            const pw = req.body?.pw;
            let status = Backend.Response.Status.InsufficientParameters;
            if(!_.isEmpty(account) && _.isString(account) && !_.isEmpty(pw) && _.isString(pw)){
                 status = await AuthModel.register(account,pw);
                if(status === Backend.Response.Status.Success){
                    return Backend.Response.success(res, {});
                }
                return Backend.Response.error(res, status, "Register Failed", 400);
            }
            return Backend.Response.error(res, status, "InsufficientParameters", 400);
        }catch(err){
            console.log("ERRR")
        }
    }

    public async logIn(req:express.Request, res:express.Response):Promise<void>{
        try{
            // TODO 使用帳密登入 或 TOKEN
            const token = LoginToken.generateToken(req.body.account);
            Backend.Response.success(res,{token});
        }catch(err){
            console.log("ERRR")
        }
    }



}

