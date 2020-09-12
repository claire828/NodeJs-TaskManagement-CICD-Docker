import TaskConfig from "./taskConfig";


// tslint:disable-next-line: no-namespace
namespace MongoConfig {


    export enum Dbs {
        Rolo = 'rolo',
    }

    export enum Collections{
        Tasks = 'tasks',
        Users = 'users'
    }

    export namespace Scheme{

        export type UserCollect = {
            // TODO 這個ID可以改成autoIncrease
            // uId:string,
            account:string,
            pw:string,
            joinT:string
       }

       export type TaskCollect = {
            account:string,
            drafs:string[],
            tasks:TaskConfig.Task[],
       }
    }






}
export default MongoConfig;