// tslint:disable-next-line: no-namespace
namespace TaskConfig{

    export enum Status{
        Draf,
        Confirm
    }
    export type Draf = {
        title:string,
        content:string,
    }

    export type Task = Draf & {
        tId:string,
        status:Status,
        t?:Time,
        asign?:string,
    }
    export type Time = {
        st:string,
        et?:string,
    }

}
export default TaskConfig;