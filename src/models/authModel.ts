import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import MongoConfig from "../configs/mongoConfig";
import Backend from "../modules/backend";
import bcrypt from 'bcrypt';
import { LoginToken } from "../modules/token";


export default class AuthModel{

    public static async register(account:string, pw:string):Promise<Backend.Response.Status>{
        const bValidation = await this.validateRegist(account);
        if(bValidation!== Backend.Response.Status.Success) return bValidation;
        try{
            const hashedPassword = await bcrypt.hash(pw, LoginToken.SaltRounds)
            const user:MongoConfig.Scheme.UserCollect = {
                account,
                pw:hashedPassword,
                joinT :Date.now().exFloorTimeToSec().toString()
            }
            console.log(`存進去Mongo: ${JSON.stringify(user)}`);
             MongoInst.roloUsers.insertOne(user);
            return Backend.Response.Status.Success;
        }catch(err){
            return Backend.Response.Status.FailureExecuting;
        }
    }



    private static async validateRegist(account:string):Promise<Backend.Response.Status>{
        if(this.validateEmail(account)){
            const bExist = await this.isUserExist(account);
            return bExist ? Backend.Response.Status.UserExisting : Backend.Response.Status.Success;
        }
        return Backend.Response.Status.EmailError;
    }

    private static validateEmail(email:string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    private static async isUserExist(account:string):Promise<boolean>{
        const result = await MongoInst.roloUsers.findOne({account});
        return (result as unknown as boolean);
    }

}