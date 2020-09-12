import TaskConfig from "../configs/TaskConfig";
import TedisInst from "../instances/tedisInst";
import { Tedis } from "tedis";


export default abstract class DbModel{

    protected get db():Tedis{return  TedisInst.get();}
    protected abstract readonly ExpiredSec:number;

    abstract async getAll(account:string):Promise<TaskConfig.Task[]>;
    abstract async saveAll(account:string, allTasks:TaskConfig.Task[]):Promise<void>;
    abstract async add(account:string, draf:TaskConfig.Draf, tId:string):Promise<boolean>;
    abstract async conform(account:string, tId:string, task?:TaskConfig.Task ):Promise<TaskConfig.Task>;

    protected async retrieveByKey(key:string):Promise<string>{
        const oldCache = await this.db.get(key);
        return oldCache?.toString() || null;
    }

    public generateTaskID(account:string):string{
        return `${account}${Date.now().exToSec()}`;
    }
}

