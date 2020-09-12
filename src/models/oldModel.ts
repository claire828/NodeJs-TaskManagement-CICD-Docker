import TaskConfig from "../configs/TaskConfig";
import TedisInst from "../instances/tedisInst";
import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';

// TODO 感覺這個可以新增一個Class作為CacheServer
export default class OldModel{
    private static readonly DrafExpiredSec = (24).exHoursInSec();
    private static readonly CachedExpiredSec = (4).exHoursInSec();


    // [API-getAllTask] 從cache server中取得，如果不存在就從mongo取出
    public static async getTasksFromCacheServer(account:string):Promise<TaskConfig.Task[]>{
        console.log("do:取得所有任務清單");
        const strTasks = await this.getTask(account);
        if(strTasks) return strTasks.exToObj() as TaskConfig.Task[];
        console.log("do:CACHE server找不到資料，去MONGO拿");
        const tasks = await this.retrieveFromServer(account);
        console.log("do:拿到了塞回去");
        this.SaveTasksToCacheServers(account,tasks);
        return tasks;
    }

     // 儲存整筆Task的快取
    private static SaveTasksToCacheServers(account:string, allTasks:TaskConfig.Task[] ){
        TedisInst.get().setex(account,this.CachedExpiredSec , JSON.stringify(allTasks));
    }

    // 儲存草稿到Mongo&Redis
    public static async addDrafToServer(account:string, draf:TaskConfig.Draf ):Promise<boolean>{
        try{
            const tId:string = this.generateTaskID(account);
            await Promise.all([
                TedisInst.get().setex(tId, this.DrafExpiredSec, JSON.stringify(draf)),
                MongoInst.roloTasks.updateOne({account},{$addToSet:{drafs:tId}},{upsert:true})
            ]);
            this.addItemFromCacheList(account, draf, tId);
            return true;
        }catch(err){
            return false;
        }
    }

    public static async conformDrafToTask(account:string, tId:string){
        const value = await this.getTask(tId);
        if(!value) return;
        await TedisInst.get().del(tId);
        const draf = value.exToObj() as TaskConfig.Draf;
        const mappingStruct = this.generateMappingStruct(draf,tId,TaskConfig.Status.Conform, {
            st:Date.now().exToSec().toString()
        });
        const task = this.mappingDrafToTaskStruct(mappingStruct);
        await MongoInst.roloTasks.updateOne({account},{$addToSet:{tasks:task},$pull:{drafs:tId}},{upsert:true});
        this.updateItemFromCacheList(account, mappingStruct);
    }

    // 原有的快取資料中，新增新的快取
    private static async addItemFromCacheList(account:string, draf:TaskConfig.Draf, tId:string){
        const oldCache = await this.getTask(account)
        if(oldCache){
            const cacheList:TaskConfig.Task[] = (oldCache.exToObj() as TaskConfig.Task[]);
            const mappingStruct = this.generateMappingStruct(draf,tId,TaskConfig.Status.Draf);
            cacheList.push(this.mappingDrafToTaskStruct(mappingStruct));
            this.SaveTasksToCacheServers(account,cacheList);
        }
    }


    private static async updateItemFromCacheList( account:string, mappingStruct:MappingStruct){
        const oldCache = await this.getTask(account)
        if(oldCache){
            const cacheList:TaskConfig.Task[] = (oldCache.exToObj() as TaskConfig.Task[]);
            const inx = cacheList.findIndex( x=> x.tId === mappingStruct.tId);
            const target = cacheList[inx];
            target.status = TaskConfig.Status.Conform;
            target.t = mappingStruct.time;
            this.SaveTasksToCacheServers(account,cacheList);
        }
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
            const mappingStruct = this.generateMappingStruct(draf,tId,TaskConfig.Status.Draf);
            list.push(this.mappingDrafToTaskStruct(mappingStruct));
        }
        return list;
    }

    // 媒合草稿到正式
    private static mappingDrafToTaskStruct(struct:MappingStruct):TaskConfig.Task{
        return {
            title:struct.draf.title,
            content:struct.draf.content,
            tId:struct.tId,
            status:struct.status,
            t:struct.time
        }
    }


    private static generateMappingStruct(draf:TaskConfig.Draf,tId:string,status:TaskConfig.Status,time?:TaskConfig.Time):MappingStruct{
        return {
            draf,
            tId,
            status,
            time
        }
    }
    private static generateTaskID(account:string):string{
        return `${account}${Date.now().exToSec()}`;
    }


}

type MappingStruct = {
    draf:TaskConfig.Draf,
    tId:string,
    status:TaskConfig.Status,
    time:TaskConfig.Time,

}
