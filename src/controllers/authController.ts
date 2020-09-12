import express from 'express';
import Response from '../modules/backend';
import AuthModel from '../models/authModel';
import _ from 'underscore';
import { LoginToken } from '../modules/token';

export default class AuthController{


    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            const [account, pw] = [req.body?.account, req.body?.pw];
            let status = Response.Status.InsufficientParams;
            if(!_.isEmpty(account) && _.isString(account) && !_.isEmpty(pw) && _.isString(pw)){
                status = await AuthModel.registerUser(account,pw);
                if(status === Response.Status.Success){
                    return Response.success(res, {});
                }
                return Response.error(res, status, "Register Failed", 400);
            }
            return Response.error(res, status, "InsufficientParams", 400);
        }catch(err){
            console.log("ERRR")
        }
    }

    public async logIn(req:express.Request, res:express.Response):Promise<void>{
        try{
            const [account, pw] = [req.body?.account, req.body?.pw];
            if(!_.isEmpty(account) && _.isString(account) && !_.isEmpty(pw) && _.isString(pw)){
                if(await AuthModel.isUserMath(account,pw)){
                    const token = LoginToken.generateToken(req.body.account);
                    return Response.success(res,{token});
                }
                return Response.error(res, Response.Status.Verify, "login Failed", 400);
            }
            return Response.error(res, Response.Status.InsufficientParams, "InsufficientParams", 400);
        }catch(err){
            console.log("ERRR")
        }
    }



}

