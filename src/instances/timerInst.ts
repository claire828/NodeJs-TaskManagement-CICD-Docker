
import { EventType } from "../events/baseEvent";
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

    public addListen(event: EventType.UpdateBySec, action: (ts:number) => void){
        this.event.on(event, action);
    }

    public rmListent(event:EventType.UpdateBySec, action: (ts:number) => void){
        this.event.rm(event,action);
    }

}