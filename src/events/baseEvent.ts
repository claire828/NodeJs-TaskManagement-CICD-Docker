
import  {EventEmitter}  from "events";


export enum EventType{
    UpdateBySec = "UpdateBySec",
}

export default abstract class BaseEvent {

    protected event: EventEmitter = new EventEmitter ();

    public on(event: EventType, action: (...args:any[]) => void) {
        this.event.on(event, action);
    }

    public emit(event:EventType, ...args:any[]):void{
        this.event.emit(event, ...args);
    }

    public rm(event: EventType, action: (...args:any[]) => void){
        this.event.removeListener(event,action);
    }
}