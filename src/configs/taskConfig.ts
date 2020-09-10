// tslint:disable-next-line: no-namespace
namespace TaskConfig{

    export enum Status{
        Draf,
        Conform
    }
    export type Basic = {
        title:string,
        content:string,
    }

    export type Task = Basic & {
        tId:string,
        status:Status,
        t?:Time,
        asign?:string,
    }
    export type Time = {
        st:string | number,
        et?:string | number,
    }


}
export default TaskConfig;