
import express from 'express';
import crypto from 'crypto';

// tslint:disable-next-line: no-namespace
namespace Auth{
    export function VerifyToken(req:express.Request):boolean{
        // TODO HMAC解密實作
        /*const secret = 'abcdefg';
        const hash = crypto.createHmac('sha256', secret)
                        .update('I love cupcakes')
                        .digest('hex');
        console.log(`驗證:${hash}`);*/
        return true;
    }

    export function GenerateToken(user:string){
        console.log("產出token");
    }

    export async function IsUserExist(user:string):Promise<boolean>{
        return true;
    }
}

export default Auth;