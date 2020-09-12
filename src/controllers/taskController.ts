import express from 'express';
import Response from '../modules/backend';
import TaskConfig from '../configs/TaskConfig';
import '../extensions/numberExtension';
import '../extensions/dateExtension';
import '../extensions/arrayExtension';
import TaskModel from '../models/taskModel';
import DbModel from '../models/dbModel';
import CacheModel from '../models/cacheModel';



export type cacheServers<T> = {
    taskDb: T,
    cacheDb: T,
}

export default class TaskController {

    private readonly CacheDbs:cacheServers<DbModel> = {
        taskDb : new TaskModel() as DbModel,
        cacheDb : new CacheModel() as DbModel
    };


    private unknowErrorHandler(res:express.Response, err:any, msg?:string){
        // TODO 資料要補寫到System的Log中
        console.log(`##CatchError##:${err instanceof Error ? err.stack : err}`);
        return Response.error(res,Response.Status.FailureExecuting,msg,400);
    }

    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
    public async getTasks(req:express.Request, res:express.Response):Promise<void>{
        try{
            const account:string = req.body.account;
            let allTasks = await this.CacheDbs.cacheDb.getTasks(account);
            if(!allTasks){
                allTasks = await this.CacheDbs.taskDb.getTasks(account);
                this.CacheDbs.cacheDb.saveTasks(account,allTasks);
            }
            Response.success(res,allTasks);
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
            const draf:TaskConfig.Draf = {
                title: req.body.title,
                content: req.body.content
            }
            const account:string = req.body.account;
            const tId:string = this.CacheDbs.taskDb.generateTaskID(account);
            const bSuccess = await this.CacheDbs.taskDb.addTask(account,draf,tId);
            if(bSuccess){
                this.CacheDbs.cacheDb.addTask(account,draf,tId);
                return Response.success(res,{});
            }
            return Response.error(res,Response.Status.DBError,"",201);
        }catch(err){
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
            const account:string = req.body.account;
            const tId:string = req.body.tid;
            const task = await this.CacheDbs.taskDb.conformTask(account,tId);
            if(task){
                this.CacheDbs.cacheDb.conformTask(account,tId,task);
                return Response.success(res,{})
            }
            return Response.error(res,Response.Status.DBError,"",400);
        }catch(err){
            // return this.unknowErrorHandler(res,err);
        }
    }




}

