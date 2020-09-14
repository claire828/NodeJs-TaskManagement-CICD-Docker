import express from 'express';
import Response from '../modules/backend';
import AuthModel from '../models/authModel';
import _ from 'underscore';
import { LoginToken } from '../modules/token';
import { Req } from '../modules/req';

export default class AuthController{


    public async register(req:express.Request, res:express.Response){
        const param = this.mappingAuthParam(req);
        if(!param) return Response.paramsError(res);
        const status = await AuthModel.registerUser(param.account,param.pw);
        if(status === Response.Status.Success){
            return Response.success(res, {});
        }
        console.log(`code:!!${status}`);
        return Response.error(res,status,"",400);
    }

    public async logIn(req:express.Request, res:express.Response){
        const param = this.mappingAuthParam(req);
        if(!param) return Response.paramsError(res);
        const bMatch = await AuthModel.isUserMath(param.account,param.pw);
        if(bMatch){
            const token = LoginToken.generateToken(req.body.account);
            return Response.success(res,{token});
        }
        return Response.error(res, Response.Status.Verify, '', 400);
    }

    private mappingAuthParam(req:express.Request){
        return Req.parsePostParam(req, {
            account: Req.ParseParamType.String,
            pw:Req.ParseParamType.String
        });
    }

}

