import express, { json } from 'express';
import Backend from '../modules/backend';
import TedisInst from '../instances/tedisInst';
import MongoInst from '../instances/mongoInst';
import MongoConfig from '../configs/mongoConfig';
import Auth from '../modules/auth';

// TODO Request的Account還沒加入 & 密碼也要加上
export default class AuthController{

    private responseError(res:express.Response, err:any, msg?:string){
        console.log( err instanceof Error ? err.stack : err);
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,401);
    }


    public async register(req:express.Request, res:express.Response):Promise<void>{
        try{
            const user:MongoConfig.Scheme.UserCollect = {
                account: req.body.account,
                pw: "",
                joinT: Date.now().exFloorTimeToSec().toString()
            }
            await MongoInst.roloUsers.insertOne(user);
            const token = Auth.generateToken(user.account);
            Backend.Response.success(res,token);
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

