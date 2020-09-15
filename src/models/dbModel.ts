import TaskConfig from "../configs/taskConfig";
import TedisInst from "../instances/tedisInst";
import { Tedis } from "tedis";

/**
 * Basic DB Model.
 */
export default abstract class DbModel{

    protected get db():Tedis{return  TedisInst.get();}
    protected abstract readonly ExpiredSec:number;

    abstract async getAll(account:string):Promise<TaskConfig.Task[]>;
    abstract async add(account:string, draft:TaskConfig.Draft, tId:string):Promise<boolean>;
    abstract async confirm(account:string, tId:string, task?:TaskConfig.Task ):Promise<TaskConfig.Task>;
    public async saveAll(account:string, allTasks:TaskConfig.Task[]):Promise<void>{
        return;
    }
    protected async retrieveByKey(key:string):Promise<string>{
        const oldCache = await this.db.get(key);
        return oldCache?.toString() || null;
    }

    public generateTaskID(account:string):string{
        return `${account}${Date.now().exToSec()}`;
    }
}

