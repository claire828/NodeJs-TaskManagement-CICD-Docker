
import  {EventEmitter}  from "events";

export enum EventType{
    UpdateBySec = "UpdateBySec",
}


export default abstract class BaseEvent {

    protected event: EventEmitter = new EventEmitter ();

    public on(event: EventType, action: (...args:any[]) => void):EventHandle {
        const handler:EventHandle = [event, action]
        this.event.on(event, action);
        return handler;
    }

    public emit(event:EventType, ...args:any[]):void{
        this.event.emit(event, ...args);
    }

    public rm(handle: EventHandle){
        const [event, listener] = handle;
        this.event.removeListener(event,listener);
    }
}
export type EventHandle = [EventType, (...args:any[]) => void];