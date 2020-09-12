import TaskConfig from "../configs/TaskConfig";
import TedisInst from "../instances/tedisInst";
import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import CacheModel from "./cacheModel";
import DbModel from "./dbModel";

// TODO 感覺這個可以新增一個Class作為CacheServer
export default class TaskModel extends DbModel{
    readonly ExpiredSec = (24).exHoursInSec();

    // [API-getAllTask] 從cache server中取得，如果不存在就從mongo取出
    public async getTasks(account:string):Promise<TaskConfig.Task[]>{
        return await this.retrieveFromServer(account);
    }

    public async saveTasks(account:string, allTasks:TaskConfig.Task[] ){
        return;
    }
    // 儲存草稿到Mongo&Redis
    public async addTask(account:string, draf:TaskConfig.Draf, tId:string):Promise<boolean>{
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

    public async conformTask(account:string, tId:string , task?:TaskConfig.Task):Promise<TaskConfig.Task>{
        const value = await this.getTask(tId);
        if(!value) return null;
        await TedisInst.get().del(tId);
        const draf = value.exToObj() as TaskConfig.Draf;
        task = {
            title: draf.title ?? "",
            content: draf.content ?? "",
            tId,
            status:TaskConfig.Status.Conform,
            t:{st:Date.now().exToSec().toString()}
        };
        await MongoInst.roloTasks.updateOne({account},{$addToSet:{tasks:task},$pull:{drafs:tId}},{upsert:true});
        return task;
    }


    private async getTask(key:string):Promise<string>{
        const oldCache = await TedisInst.get().get(key);
        return oldCache?.toString() || null;
    }

    // 從正式ＤＢ中取得資料
    private async retrieveFromServer(account:string):Promise<TaskConfig.Task[]>{
        const target = await MongoInst.roloTasks.findOne({account});
        const list = target.tasks ?? [];
        for (const tId of target.drafs){
            const task = await this.getTask(tId);
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
