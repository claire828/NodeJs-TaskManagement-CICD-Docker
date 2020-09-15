import TaskConfig from "../configs/taskConfig";
import TedisInst from "../instances/tedisInst";
import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import DbModel from "./dbModel";

/**
 * Redis DB - Cache Drafts Infomation.
 * Redis <Key, Value> = <TaskID, TaskInfomation(draft) >
 */
export default class TaskModel extends DbModel{
    readonly ExpiredSec = (24).exHoursInSec();

    public async getAll(account:string):Promise<TaskConfig.Task[]>{
        return await this.retrieveFromServer(account);
    }

    public async add(account:string, draft:TaskConfig.Draft, tId:string):Promise<boolean>{
        try{
            await Promise.all([
                TedisInst.get().setex(tId, this.ExpiredSec, JSON.stringify(draft)),
                MongoInst.roloTasks.updateOne({account},{$addToSet:{drafts:tId}},{upsert:true})
            ]);
            return true;
        }catch(err){
            return false;
        }
    }

    public async confirm(account:string, tId:string , task?:TaskConfig.Task):Promise<TaskConfig.Task>{
        const value = await this.retrieveByKey(tId);
        if(!value) return null;
        await TedisInst.get().del(tId);
        const draft = value.exToObj() as TaskConfig.Draft;
        task = {
            title: draft.title,
            content: draft.content,
            tId,
            status:TaskConfig.Status.Confirm,
            t:{st:Date.now().exToSec().toString()}
        };
        await MongoInst.roloTasks.updateOne({account},{$addToSet:{tasks:task},$pull:{drafts:tId}},{upsert:true});
        return task;
    }

    private async retrieveFromServer(account:string):Promise<TaskConfig.Task[]>{
        const target = await MongoInst.roloTasks.findOne({account});
        const list = target.tasks ?? [];
        for (const tId of target.drafts){
            const task = await this.retrieveByKey(tId);
            if(!task) continue;

            const draft = task.exToObj() as TaskConfig.Draft;
            list.push({
                title:draft.title,
                content:draft.content,
                tId,
                status:TaskConfig.Status.Draft,
            });
        }
        return list;
    }


}
