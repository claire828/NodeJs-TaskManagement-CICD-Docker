import BaseEvent, { EventType } from "./baseEvent"


export default class TimerEvent extends BaseEvent implements TimerImp{

    public on(event: EventType.UpdateBySec, action: (ts:number) => void): void;
    public on(event: EventType, action: (...args:any[]) => void) {
        super.on(event,action);
    }

    public emit(event: EventType.UpdateBySec, ts:number):void;
    public emit(event: EventType, ...args:any[]) {
        super.emit(event,...args);
    }


}