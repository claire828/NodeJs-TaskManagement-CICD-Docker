import TaskConfig from "../configs/TaskConfig";
import TedisInst from "../instances/tedisInst";
import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import CacheModel from "./cacheModel";

// TODO 感覺這個可以新增一個Class作為CacheServer
export default class TaskModel{
    private static readonly ExpiredSec = (24).exHoursInSec();

    // [API-getAllTask] 從cache server中取得，如果不存在就從mongo取出
    public static async getTasks(account:string):Promise<TaskConfig.Task[]>{
        let tasks = await CacheModel.getTasks(account);
        if(tasks) return tasks;
        console.log("do:CACHE server找不到資料，去MONGO拿");
        tasks = await this.retrieveFromServer(account);
        CacheModel.SaveTasksToCache(account,tasks);
        return tasks;
    }


    // 儲存草稿到Mongo&Redis
    public static async addTask(account:string, draf:TaskConfig.Draf, tId:string):Promise<boolean>{
        try{
            await Promise.all([
                TedisInst.get().setex(tId, this.ExpiredSec, JSON.stringify(draf)),
                MongoInst.roloTasks.updateOne({account},{$addToSet:{drafs:tId}},{upsert:true})
            ]);
            CacheModel.addTask(account, draf, tId);
            return true;
        }catch(err){
            return false;
        }
    }

    public static async conformDrafToTask(account:string, tId:string , task?:TaskConfig.Task):Promise<boolean>{
        const value = await this.getTask(tId);
        if(!value) return false;
        await TedisInst.get().del(tId);
        const draf = value.exToObj() as TaskConfig.Draf;
        task = {
            title: draf.title,
            content: draf.content,
            tId,
            status:TaskConfig.Status.Conform,
            t:{st:Date.now().exFloorTimeToSec().toString()}
        };

        await MongoInst.roloTasks.updateOne({account},{$addToSet:{tasks:task},$pull:{drafs:tId}},{upsert:true});
        CacheModel.conformDrafToTask(account, tId , task);
        return true;
    }


    private static async getTask(key:string):Promise<string>{
        const oldCache = await TedisInst.get().get(key);
        return oldCache?.toString() || null;
    }

    // 從正式ＤＢ中取得資料
    private static async retrieveFromServer(account:string):Promise<TaskConfig.Task[]>{
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

    public static generateTaskID(account:string):string{
        return `${account}${Date.now().exFloorTimeToSec()}`;
    }


}
