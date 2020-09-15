
import { EventType, EventHandle } from "../events/baseEvent";
import TimerEvent from "../events/timerEvent";


export default class TimerInst{

    private static inst:TimerInst;
    private event:TimerEvent;
    private ts:number;

    public static get instance():TimerInst{
        return this.inst || (this.inst = new this());
    }

    constructor(){
        this.ts = Date.now().exToSec();
        this.event = new TimerEvent();
        setInterval(this.timeLoop.bind(this),1000);
    }

    private timeLoop():void{
        ++this.ts;
        this.dispatchSecLoop();
    }

    private dispatchSecLoop():void{
        this.event.emit(EventType.UpdateBySec,this.ts);
    }

    public subscribe(event: EventType.UpdateBySec, action: (ts:number) => void):EventHandle{
        return this.event.on(event, action);
    }

    public unsubscribe(eventHandle:EventHandle){
        this.event.rm(eventHandle);
    }

}