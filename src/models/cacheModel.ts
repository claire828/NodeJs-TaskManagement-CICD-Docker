import TaskConfig from "../configs/taskConfig";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import DbModel from "./dbModel";

/**
 * Using For Caching TaskList.
 * Redis<Key,Value> = < UserAccount, taskList>
 */
export default class CacheModel extends DbModel {

    readonly ExpiredSec = (4).exHoursInSec();

    public async getAll(account:string):Promise<TaskConfig.Task[]>{
        const strTasks = await this.retrieveByKey(account);
        if(strTasks) return strTasks.exToObj() as TaskConfig.Task[];
        return null;
    }

    public async saveAll(account:string, allTasks:TaskConfig.Task[] ){
        this.db.setex(account,this.ExpiredSec , JSON.stringify(allTasks));
    }

    public async add(account:string, draft:TaskConfig.Draft, tId:string):Promise<boolean>{
        const cacheList = await this.retrieveTaskList(account)
        if(cacheList){
            cacheList.push({
                title:draft.title,
                content:draft.content,
                tId,
                status:TaskConfig.Status.Draft,
            });
            this.saveAll(account,cacheList);
        }
        return true;
    }

    public async confirm( account:string, tId:string, task:TaskConfig.Task ):Promise<TaskConfig.Task>{
        const cacheList = await this.retrieveTaskList(account)
        if(cacheList){
            const inx = cacheList.findIndex( x=> x.tId === tId);
            if(inx === -1) return;
            cacheList[inx] = task;
            this.saveAll(account,cacheList);
        }
        return task;
    }

    public async retrieveTaskList(account:string):Promise<TaskConfig.Task[]>{
        const oldCache = await this.retrieveByKey(account);
        return oldCache ? (oldCache.exToObj() as TaskConfig.Task[]) : null;
    }



}
