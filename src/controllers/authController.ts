import express from 'express';
import Backend from '../modules/backend';
import AuthModel from '../models/authModel';
import _ from 'underscore';
import { LoginToken } from '../modules/token';

export default class AuthController{


    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            const [account, pw] = [req.body?.account, req.body?.pw];
            let status = Backend.Response.Status.InsufficientParameters;
            if(!_.isEmpty(account) && _.isString(account) && !_.isEmpty(pw) && _.isString(pw)){
                status = await AuthModel.registerUser(account,pw);
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
            const [account, pw] = [req.body?.account, req.body?.pw];
            if(!_.isEmpty(account) && _.isString(account) && !_.isEmpty(pw) && _.isString(pw)){
                if(await AuthModel.isUserMath(account,pw)){
                    const token = LoginToken.generateToken(req.body.account);
                    return Backend.Response.success(res,{token});
                }
                return Backend.Response.error(res, Backend.Response.Status.Verify, "login Failed", 400);
            }
            return Backend.Response.error(res, Backend.Response.Status.InsufficientParameters, "InsufficientParameters", 400);
        }catch(err){
            console.log("ERRR")
        }
    }



}

