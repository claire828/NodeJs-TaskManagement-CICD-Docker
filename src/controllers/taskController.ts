import express from 'express';
import Response from '../modules/backend';
import TaskConfig from '../configs/taskConfig';
import '../extensions/numberExtension';
import '../extensions/dateExtension';
import '../extensions/arrayExtension';
import TaskModel from '../models/taskModel';
import DbModel from '../models/dbModel';
import CacheModel from '../models/cacheModel';
import { Req } from '../modules/req';
import AutoNotify, { NotifyConfig } from '../services/email/autoNotify';

export type cacheServers<T> = {
    taskDb: T,
    cacheDb: T,
}

export default class TaskController {

    private readonly CacheDbs:cacheServers<DbModel> = {
        taskDb : new TaskModel() as DbModel,
        cacheDb : new CacheModel() as DbModel
    };

    private notifyCacheQueue:AutoNotify[] = [];

    public async getTasks(req:express.Request, res:express.Response):Promise<void>{
        const param = Req.parsePostParam(req, {
            account: Req.ParseParamType.String,
        });
        if(!param) return Response.paramsError(res);
        try{
            let allTasks = await this.CacheDbs.cacheDb.getAll(param.account);
            if(!allTasks){
                allTasks = await this.CacheDbs.taskDb.getAll(param.account);
                this.CacheDbs.cacheDb.saveAll(param.account,allTasks);
            }
            Response.success(res,allTasks);
        }catch(err){
            return Response.error(res,Response.Status.FailureExecuting,"",400);
        }
    }


    public async addTask(req:express.Request, res:express.Response):Promise<void>{
        const param = Req.parsePostParam(req, {
            account: Req.ParseParamType.String,
            title: Req.ParseParamType.String,
            content: Req.ParseParamType.String
        });
        if(!param) return Response.paramsError(res);

        const draf:TaskConfig.Draf = {
            title: param.title,
            content: param.content
        }
        const tId:string = this.CacheDbs.taskDb.generateTaskID(param.account);
        const bSuccess = await this.CacheDbs.taskDb.add(param.account,draf,tId);
        if(bSuccess){
            this.startEmailNotifyProcess(param.title, param.account);
            this.CacheDbs.cacheDb.add(param.account,draf,tId);
            return Response.success(res,{});
        }
        return Response.error(res,Response.Status.DBError,"",400);
    }


    public async confirmTask(req:express.Request, res:express.Response):Promise<void>{
        const param = Req.parsePostParam(req, {
            account: Req.ParseParamType.String,
            tId: Req.ParseParamType.String,
        });
        if(!param) return Response.paramsError(res);

        try{
            const task = await this.CacheDbs.taskDb.confirm(param.account,param.tId);
            if(task){
                this.CacheDbs.cacheDb.confirm(param.account,param.tId,task);
                return Response.success(res,{});
            }
            return Response.paramsError(res);
        }catch(err){
            return Response.error(res,Response.Status.DBError,"",400);
        }
    }

    private startEmailNotifyProcess(title:string, toAddress:string){
        const config:NotifyConfig = {
            title,
            toAddress,
            destroy: this.gcNotify
        };
        const notifyObj:AutoNotify = new AutoNotify(config);
        this.notifyCacheQueue.push(notifyObj);
     }

     private gcNotify = (x:AutoNotify)=>{
        const inx = this.notifyCacheQueue.indexOf(x);
        let elem = this.notifyCacheQueue.exRemoveAt(inx);
        if(elem) elem = null;
     }

}

