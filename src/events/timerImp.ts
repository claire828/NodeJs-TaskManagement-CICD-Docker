import { EventType } from "./baseEvent";


export default interface TimerImp{
    on(event: EventType.UpdateBySec, action:() => void):void;
    emit(event: EventType.UpdateBySec,  ...args:any[]): void;
}