import express, { json } from 'express';
import Backend from '../modules/backend';

export enum TaskStatus{
    Draf,
    Process,
    Expired
}

export type Task = {
    email:string,
    title:string,
    createdTime?:number | string,
}


export default class TaskController{

    private ResponseError(res:express.Response, err:any, msg?:string){
        console.log( err instanceof Error ? err.stack : err);
        return Backend.Response.error(res,Backend.Response.ErrorCode.FailureExecuting,msg,201);
    }

    public async getTasks(req:express.Request, res:express.Response):Promise<void>{
        try{
            // TODO [API]取得所有Task
            console.log(`receive:[getTasks] ${JSON.stringify(req.body)}`);
            return Backend.Response.success(res,{});
        }catch(err){
            return this.ResponseError(res,err);
        }
    }


    public async addTasks(req:express.Request, res:express.Response):Promise<void>{
        console.log(`receive:[addTasks]`);
        // TODO HMAC解密
        try{
            // await this.checkUserExist("");
            // TODO Mapping Req資料
           /* const tasks:Task[] = JSON.parse(req.body.tasks);
            for await(const task of tasks){
                this.addTask(task);
            }*/
            return Backend.Response.success(res,{});
        }catch(err){
            console.log( err instanceof Error ? err.stack : err);
            return Backend.Response.error(res,Backend.Response.ErrorCode.FailureExecuting,'',201);
        }
    }

    private async addTask(task:Task):Promise<void>{
        console.log(`addSingleTask Name:${task.title}`);
    }

    private async checkUserExist(account:string):Promise<void>{
        // TODO 確認使用者存在否
        const bExist:boolean = false;
        console.log(`Check user[${account}] exist or not?`);
        if(true){
            await this.createUser(account);
        }
        return new Promise((resolve, reject) =>{ resolve()});
    }

    private async createUser(account:string):Promise<void>{
        console.log('[Create Account]');
        // TODO 創造帳號
    }

}

