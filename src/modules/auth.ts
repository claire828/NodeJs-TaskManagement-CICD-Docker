
import express from 'express';
import crypto from 'crypto';
import MongoInst from '../instances/mongoInst';

// tslint:disable-next-line: no-namespace
namespace Auth{
    export async function isTokenLegal(token:string):Promise<boolean>{
        // TODO HMAC解密實作
        /*const secret = 'abcdefg';
        const hash = crypto.createHmac('sha256', secret)
                        .update('I love cupcakes')
                        .digest('hex');
        console.log(`驗證:${hash}`);*/
        return true;
    }

    export function generateToken(user:string){
        return {
            token:"sfjdslfjl"
        };
    }

    export async function isUserExist(account:string):Promise<boolean>{
        const result = await MongoInst.RoloUsers.findOne({account});
        return (result as unknown as boolean);
    }

    export async function isRegistLegal(account:string):Promise<boolean>{
        return !(await Auth.isUserExist(account));
    }

    export async function isAuthLegal(account:string):Promise<boolean>{
        return await Auth.isUserExist(account);
    }


}

export default Auth;