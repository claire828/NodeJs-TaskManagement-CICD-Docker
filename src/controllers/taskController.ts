import express, { json } from 'express';
import Backend from '../modules/backend';
import TedisInst from '../instances/tedisInst';
import TaskConfig from '../configs/TaskConfig';
import MongoInst from '../instances/mongoInst';
import '../extensions/numberExtension';
import '../extensions/dateExtension';
import '../extensions/arrayExtension';

export enum TaskStatus{
    Draf,
    Process,
    Expired
}

export default class TaskController{
    private readonly ExpiredHours = 24;

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
            // Step2 (skip）先看CacheServer有沒有資料
            // Step3 (skip)CacheServer沒有資料，就抓MongoDB的回存 （skip 4)
            const account:string = req.body.account;
            const target = await MongoInst.roloTasks.findOne({account});
            for (const tId of target.drafs){
                const task = await TedisInst.get().get(tId);
                if(task ){
                    const valueJson = JSON.parse(task.toString()) as TaskConfig.Basic;
                    target.tasks.push({
                        title:valueJson.title,
                        content:valueJson.content,
                        tId,
                        status:TaskConfig.Status.Draf
                    });
                }
            }
            Backend.Response.success(res,target.tasks);
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
            // TODO 目前是假資料，補上正式的
            const account:string = req.body.account;
            const taskID:string = this.generateTaskID(account)
            const tasks:TaskConfig.Basic = {
                title:"",
                content:"",
            }
            await TedisInst.get().setex(taskID, this.ExpiredHours.exHoursInSec() , JSON.stringify(tasks));
            await MongoInst.roloTasks.updateOne({account},{$addToSet:{drafs:taskID}},{upsert:true});
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
            const account:string = req.body.account;
            const tId:string = req.body.tid;
            const value = await TedisInst.get().get(tId);
            await TedisInst.get().del(tId);
            const valueJson = JSON.parse(value.toString()) as TaskConfig.Basic;
            const task:TaskConfig.Task = {
                title: valueJson.title,
                content: valueJson.content,
                tId,
                status:TaskConfig.Status.Conform,
                t:{
                    st:Date.now().exFloorTimeToSec().toString()
                }
            }
            await MongoInst.roloTasks.updateOne({account},{$addToSet:{tasks:task},$pull:{drafs:tId}},{upsert:true});
            // TODO Step5 更新到Cache Server (刪除cache)
            return Backend.Response.success(res,{});
        }catch(err){
            return this.unknowErrorHandler(res,err);
        }
    }


    private generateTaskID(account:string):string{
        return `${account}${Date.now().exFloorTimeToSec()}`
    }

}

