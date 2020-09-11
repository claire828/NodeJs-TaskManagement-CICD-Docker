
import express from 'express';
import crypto from 'crypto';
import MongoInst from '../instances/mongoInst';

// tslint:disable-next-line: no-namespace
namespace Auth{
    export async function isTokenLegal(token:string):Promise<boolean>{
        // TODO HMAC解密實作
        // crypto.timingSafeEqual（a，b）


        return true;
    }

    export function generateToken(user:string){
        const secret = 'abcdefg';
        const hash = crypto.createHmac('sha256', secret)
                        .update('I love cupcakes')
                        .digest('hex');
        return {
            hash
        };
    }

    export async function isUserExist(account:string):Promise<boolean>{
        const result = await MongoInst.roloUsers.findOne({account});
        return (result as unknown as boolean);
    }

    export async function isRegistLegal(account:string):Promise<boolean>{
        return !(await Auth.isUserExist(account));
    }


}

export default Auth;