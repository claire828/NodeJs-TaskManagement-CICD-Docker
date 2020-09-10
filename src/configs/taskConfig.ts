// tslint:disable-next-line: no-namespace
namespace TaskConfig{

    export enum Status{
        Draf,
        Conform
    }
    export type Basic = {
        title:string,
        content:string,
        status:Status,
    }

    export type Task<K> = Basic & {
        asign:string,
        id:string,
        t:Time,
        data?:K
    }
    export type Time = {
        st:string | number,
        et?:string | number,
    }


}
export default TaskConfig;