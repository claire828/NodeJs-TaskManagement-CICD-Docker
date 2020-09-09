import express from 'express';
import Backend from '../modules/backend';
import System from '../modules/system';
import fs from 'fs';


export default async (req:express.Request, res:express.Response): Promise<void> => {
    console.log(`收到Mail資訊:${req}, body:${JSON.stringify(req.body)}, params:${JSON.stringify(req.params)}, query:${JSON.stringify(req.query)}`);
    const params = Backend.Req.parseParam(req,{
        name:Backend.Req.PARSEPARAMTYPE.String,
        email:Backend.Req.PARSEPARAMTYPE.String,
        msg:Backend.Req.PARSEPARAMTYPE.String
    });

    if(!params){
        return Backend.Response.error(res, Backend.Response.ErrorCode.InsufficientParameters, 'Insufficient Parameters',200);
    }


    try{
        const [name, email,msg, time] = [req.body.name,req.body.email,req.body.msg,Math.floor(Date.now()/1000)];
        const formate = {
            [time]:{
                name,
                email,
                msg
            }
        }
        fs.appendFile('msg.txt',JSON.stringify(formate),(err)=>{
            if(err){
                console.log(`error:${err}`);
                return Backend.Response.error( res, Backend.Response.ErrorCode.FailureExecuting,'fail',200);
            }
            return Backend.Response.success(res,[]);
        });

    }catch(err){
        return Backend.Response.error( res, 101,'傳送emaill失敗',200);
    }
}

