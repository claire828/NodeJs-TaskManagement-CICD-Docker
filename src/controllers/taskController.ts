import express, { json } from 'express';
import Backend from '../modules/backend';
import TedisInst from '../instances/tedisInst';
import Auth from '../modules/auth';

export enum TaskStatus{
    Draf,
    Process,
    Expired
}

export default class TaskController{
    private readonly ExpiredHours = 24;

    private get stTime():number{ return Date.now().exFloorTimeToSec();}

    private unknowErrorHandler(res:express.Response, err:any, msg?:string){
        console.log( err instanceof Error ? err.stack : err);
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,401);
    }

    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
    public async getTasks(req:express.Request, res:express.Response):Promise<void>{
        try{
            // Step1 取出帳號
            // Step2 (skip）先看CacheServer有沒有資料
            // Step3 (skip)CacheServer沒有資料，就抓MongoDB的回存 （skip 4)
            // Step4 判斷MongoDB中的Draf資料是否過期 -> 比對timestamp -> 如果過期，刪掉redis的資料
            // Step5 Module取得資料，包裝回Json傳回結束
            // const email:string = req.body.email;
            // const task = await TedisInst.get().get(email);
            // Backend.Response.success(res,JSON.parse(task?.toString() || ""));
            Backend.Response.success(res,{});
        }catch(err){
            return this.unknowErrorHandler(res,err);
        }
    }

    /**
     * [API EndPoint] Add Task
     * @param req in
     * @param res out
     */
    public async addTask(req:express.Request, res:express.Response):Promise<void>{
        try{
            // Step1 取出帳號
            // Step2 產出taskID (email+timestamp)
            // Step3 將Task放進去Draf DB + 24HExpiredTime
            // Step4 將taskID存進去MongoDB - tasks collections - draf Field (with 24HExpiredTime)
            const email:string = req.body.email;
            const tasks = {
                title: req.body.name,
                st: this.stTime
            };
            await TedisInst.get().setex(email, this.ExpiredHours.exHoursInSec(), JSON.stringify(tasks));
            return Backend.Response.success(res,{});
        }catch(err){
             // TODO 資料要補寫到System的Log中
            return this.unknowErrorHandler(res,err);
        }
    }


    /**
     * [API EndPoint] conform Task
     * @param req in
     * @param res out
     */
    public async conformTask(req:express.Request, res:express.Response):Promise<void>{
        try{
            // Step1 取出帳號
            // Step2 從redis取出資料
            // Step3 將資料的expire取消 （看要不要刪除）
            // Step4 存到Mongo中
            // Step5 更新到Cache Server (刪除cache)
            return Backend.Response.success(res,{});
        }catch(err){
            return this.unknowErrorHandler(res,err);
        }
    }


}

