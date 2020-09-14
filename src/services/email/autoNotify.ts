import TimerInst from "../../instances/timerInst"
import { EventType } from "../../events/baseEvent";
import _ from "underscore";
import SimpleEmailService from "./simpleEmailService";


export interface NotifyConfig{
    toAddress:string,
    title:string,
    destroy:(x:AutoNotify)=>void
}

export default class AutoNotify{

    private sesConfig:NotifyConfig;
    private isJobDone:boolean;
    private endTime:number = 0;

    constructor(info:NotifyConfig){
        this.sesConfig = info;
        this.initial();
    }

    private initial():void{
        this.endTime = Date.now().exToSec() + _.random(5,6);
        TimerInst.instance.addListen(EventType.UpdateBySec, this.update.bind(this));
    }

    private update(time:number){
        console.log(`[consume]update ts:${time} vs end:${this.endTime}`);
        if(this.isJobDone || this.endTime > time) return;
        this.exeJobFinish();
        this.sendEmailNotify();
    }

    private exeJobFinish(){
        this.isJobDone = true;
        TimerInst.instance.rmListent(EventType.UpdateBySec,this.update.bind(this));
    }

    private async sendEmailNotify(){
        await SimpleEmailService(this.sesConfig.toAddress, this.sesConfig.title);
        this.sesConfig.destroy(this);
    }

}