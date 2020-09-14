import BaseEvent, { EventType, EventHandle } from "./baseEvent"
import TimerImp from "./timerImp";


export default class TimerEvent extends BaseEvent implements TimerImp{

    public on(event: EventType.UpdateBySec, action: (ts:number) => void): EventHandle;
    public on(event: EventType, action: (...args:any[]) => void): EventHandle {
        return super.on(event,action);
    }

    public emit(event: EventType.UpdateBySec, ts:number):void;
    public emit(event: EventType, ...args:any[]) {
        super.emit(event,...args);
    }
}

