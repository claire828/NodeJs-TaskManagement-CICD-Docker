

// tslint:disable-next-line: no-namespace
namespace MongoConfig {


    export enum Dbs {
        Rolo = 'rolo',
    }

    export enum Collections{
        Tasks = 'tasks',
        Users = 'users'
    }


    export function Scheme<T>(a:T){
        return {
            data:a,
        }
    }




}
export default MongoConfig;