import express, { json } from 'express';
import Backend from '../modules/backend';
import TedisInst from '../instances/tedisInst';

export enum TaskStatus{
    Draf,
    Process,
    Expired
}

export default class TaskController{
    private readonly ExpiredHours = 24;

    private responseError(res:express.Response, err:any, msg?:string){
        console.log( err instanceof Error ? err.stack : err);
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,401);
    }

    private get stTime():number{ return Date.now().exFloorTimeToSec();}

    public async getTasks(req:express.Request, res:express.Response):Promise<void>{
        try{
            const email:string = req.body.email;
            const task = await TedisInst.get().get(email);
            Backend.Response.success(res,JSON.parse(task?.toString() || ""));
        }catch(err){
            return this.responseError(res,err);
        }
    }

    public async addTask(req:express.Request, res:express.Response):Promise<void>{
        try{
            const email:string = req.body.email;
             const bExist = await this.checkUserExist(email);
             if(!bExist) return Backend.Response.error(res,Backend.Response.Status.Verify,'',401);
            const tasks = {
                title: req.body.name,
                st: this.stTime
            };
            await TedisInst.get().setex(email, this.ExpiredHours.exHoursInSec() ,JSON.stringify(tasks));
            return Backend.Response.success(res,{});
        }catch(err){
             // TODO 資料要補寫到System的Log中
            return this.responseError(res,err);
        }
    }

    public async conformTask(req:express.Request, res:express.Response):Promise<void>{
        try{
            return Backend.Response.success(res,{});
        }catch(err){
            return this.responseError(res,err);
        }
    }

    private async checkUserExist(account:string):Promise<number>{
        return 1;
       // return await TedisInst.get().exists(account);
    }

    private async createUser(account:string):Promise<void>{
        console.log(`[Create Account]:${account}`);
        await TedisInst.get().set(account,"{}");
    }


}

