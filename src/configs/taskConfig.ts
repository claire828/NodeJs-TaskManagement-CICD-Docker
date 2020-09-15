// tslint:disable-next-line: no-namespace
namespace TaskConfig{

    export enum Status{
        Draft,
        Confirm
    }
    export type Draft = {
        title:string,
        content:string,
    }

    export type Task = Draft & {
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