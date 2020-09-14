import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import MongoConfig from "../configs/mongoConfig";
import Response from "../modules/backend";
import bcrypt from 'bcrypt';
import { LoginToken } from "../modules/token";


export default class AuthModel{

    public static async registerUser(account:string, pw:string):Promise<Response.Status>{
        const bValidation = await this.validateRegist(account);
        if(bValidation!== Response.Status.Success) return bValidation;
        try{
            const hashedPassword = await bcrypt.hash(pw, LoginToken.SaltRounds)
            const user:MongoConfig.Scheme.UserCollect = {
                account,
                pw:hashedPassword,
                joinT :Date.now().exToSec().toString()
            }
            await MongoInst.roloUsers.insertOne(user);
            return Response.Status.Success;
        }catch(err){
            return Response.Status.FailureExecuting;
        }
    }

    public static async isUserMath(account:string, pw:string):Promise<boolean>{
        try{
            const member = await MongoInst.roloUsers.findOne({account});
            if(!member) return false;
            return await bcrypt.compare(pw,member.pw);
        }catch(err){
            return false;
        }
    }


    private static async validateRegist(account:string):Promise<Response.Status>{
        try{
            if(this.validateEmail(account)){
                const bExist = await this.isUserExist(account);
                return bExist ? Response.Status.UserExisting : Response.Status.Success;
            }
        }catch(err){
            return Response.Status.EmailError;
        }
    }

    private static validateEmail(email:string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    public static async isUserExist(account:string):Promise<boolean>{
        const result = await MongoInst.roloUsers.findOne({account});
        return (result as unknown as boolean);
    }

}