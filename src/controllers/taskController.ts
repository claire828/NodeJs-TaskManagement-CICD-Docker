import express, { json } from 'express';
import Backend from '../modules/backend';
import TedisInst from '../instances/tedisInst';
import TaskConfig from '../configs/TaskConfig';
import MongoInst from '../instances/mongoInst';
import '../extensions/numberExtension';
import '../extensions/dateExtension';
import '../extensions/arrayExtension';
import TaskModel from '../models/taskModel';


export enum TaskStatus{
    Draf,
    Process,
    Expired
}

export default class TaskController {

    private unknowErrorHandler(res:express.Response, err:any, msg?:string){
        // TODO 資料要補寫到System的Log中
        console.log(`##CatchError##:${err instanceof Error ? err.stack : err}`);
        return Backend.Response.error(res,Backend.Response.Status.FailureExecuting,msg,400);
    }

    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
    public async getTasks(req:express.Request, res:express.Response):Promise<void>{
        try{
            const account:string = req.body.account;
            const allTasks = await TaskModel.getTasks(account);
            Backend.Response.success(res,allTasks);
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
            const task:TaskConfig.Draf = {
                title: req.body.title,
                content: req.body.content
            }
            const account:string = req.body.account;
            const tId:string = TaskModel.generateTaskID(account);
            const bSuccess = await TaskModel.addTask(account,task,tId);
            if(bSuccess){
                return Backend.Response.success(res,{});
            }
            return Backend.Response.error(res,Backend.Response.Status.DBError,"",201);
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
            const success = await TaskModel.conformDrafToTask(account,tId);
            return success ? Backend.Response.success(res,{}) : Backend.Response.error(res,Backend.Response.Status.DBError,"",400);
        }catch(err){
            // return this.unknowErrorHandler(res,err);
        }
    }




}

