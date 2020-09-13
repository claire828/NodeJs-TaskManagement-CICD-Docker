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
import AWS from 'aws-sdk';


export type cacheServers<T> = {
    taskDb: T,
    cacheDb: T,
}

export default class TaskController {

    constructor(){
        AWS.config.update({
            region:'us-east-2'
        });
    }

    private readonly CacheDbs:cacheServers<DbModel> = {
        taskDb : new TaskModel() as DbModel,
        cacheDb : new CacheModel() as DbModel
    };

    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
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

    /**
     * [API EndPoint] Add Task
     * @param req in
     * @param res out
     */
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
        if(!bSuccess) return Response.error(res,Response.Status.DBError,"",400);
        this.sendEmail(param.account,draf);
        this.CacheDbs.cacheDb.add(param.account,draf,tId);
        return Response.success(res,{});
    }

    private sendEmail(account:string, draf:TaskConfig.Draf){
        // Load the AWS SDK for Node.js
        // Create sendEmail params
        const fromAddress = 'iamclaire.cheng@gmail.com';
        const params = {
            Destination: {
                ToAddresses: [account]
            },
            Message: {
                    Body: {
                        Text: {
                            Charset: "UTF-8",
                            Data: `Your draf [${draf.title}] has been created`
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: `Message from Task Manager`
                    }
                },
            Source: fromAddress,
            ReplyToAddresses: [ fromAddress ],
        };

        // Create the promise and SES service object
        const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        (data)=> {
            console.log(data.MessageId);
        }).catch(
            (err)=> {
            console.error(err, err.stack);
        });

    }

    /**
     * [API EndPoint] conform Task
     * @param req in
     * @param res out
     */
    public async conformTask(req:express.Request, res:express.Response):Promise<void>{
        const param = Req.parsePostParam(req, {
            account: Req.ParseParamType.String,
            tId: Req.ParseParamType.String,
        });
        if(!param) return Response.paramsError(res);
        try{
            const task = await this.CacheDbs.taskDb.conform(param.account,param.tId);
            if(task){
                this.CacheDbs.cacheDb.conform(param.account,param.tId,task);
                return Response.success(res,{});
            }
            return Response.paramsError(res);
        }catch(err){
            return Response.error(res,Response.Status.DBError,"",400);
        }
    }




}

