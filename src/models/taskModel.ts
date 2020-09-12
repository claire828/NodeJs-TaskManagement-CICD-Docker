import TaskConfig from "../configs/taskConfig";
import TedisInst from "../instances/tedisInst";
import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import DbModel from "./dbModel";


export default class TaskModel extends DbModel{
    readonly ExpiredSec = (24).exHoursInSec();

    public async getAll(account:string):Promise<TaskConfig.Task[]>{
        return await this.retrieveFromServer(account);
    }

    public async saveAll(account:string, allTasks:TaskConfig.Task[] ){
        return;
    }

    public async add(account:string, draf:TaskConfig.Draf, tId:string):Promise<boolean>{
        try{
            await Promise.all([
                TedisInst.get().setex(tId, this.ExpiredSec, JSON.stringify(draf)),
                MongoInst.roloTasks.updateOne({account},{$addToSet:{drafs:tId}},{upsert:true})
            ]);
            return true;
        }catch(err){
            return false;
        }
    }

    public async conform(account:string, tId:string , task?:TaskConfig.Task):Promise<TaskConfig.Task>{
        const value = await this.retrieveByKey(tId);
        if(!value) return null;
        await TedisInst.get().del(tId);
        const draf = value.exToObj() as TaskConfig.Draf;
        task = {
            title: draf.title,
            content: draf.content,
            tId,
            status:TaskConfig.Status.Conform,
            t:{st:Date.now().exToSec().toString()}
        };
        await MongoInst.roloTasks.updateOne({account},{$addToSet:{tasks:task},$pull:{drafs:tId}},{upsert:true});
        return task;
    }

    private async retrieveFromServer(account:string):Promise<TaskConfig.Task[]>{
        const target = await MongoInst.roloTasks.findOne({account});
        const list = target.tasks ?? [];
        for (const tId of target.drafs){
            const task = await this.retrieveByKey(tId);
            if(!task) continue;
            const draf = task.exToObj() as TaskConfig.Draf;
            list.push({
                title:draf.title,
                content:draf.content,
                tId,
                status:TaskConfig.Status.Draf,
            });
        }
        return list;
    }


}
