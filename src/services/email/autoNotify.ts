import TimerInst from "../../instances/timerInst"
import { EventType } from "../../events/baseEvent";
import _ from "underscore";
import SimpleEmailService from "./simpleEmailService";
import { EventHandle } from "../../events/baseEvent";


export interface NotifyConfig{
    toAddress:string,
    title:string,
    destroy:(x:AutoNotify)=>void
}

export default class AutoNotify{

    private sesConfig:NotifyConfig;
    private isJobDone:boolean;
    private endTime:number = 0;
    private eventHandler:EventHandle;

    constructor(info:NotifyConfig){
        this.sesConfig = info;
        this.initial();
    }

    private initial():void{
        this.endTime = Date.now().exToSec() + _.random(5,20);
        this.eventHandler = TimerInst.instance.addListen(EventType.UpdateBySec, this.update.bind(this));
    }

    private update(time:number){
        if(this.isJobDone || this.endTime > time) return;

        this.exeJobFinish();
        this.sendEmailNotify();
    }

    private exeJobFinish(){
        this.isJobDone = true;
        TimerInst.instance.rmListen(this.eventHandler);
    }

    private async sendEmailNotify(){
        await SimpleEmailService(this.sesConfig.toAddress, this.sesConfig.title);
        this.sesConfig.destroy(this);
    }

}