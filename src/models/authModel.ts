import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import MongoConfig from "../configs/mongoConfig";
import Backend from "../modules/backend";


export default class AuthModel{

    public static async register(account:string, secreat?:string):Promise<Backend.Response.Status>{
        try{
            const bValidation = this.validateEmail(account);
            if(!bValidation)  return Backend.Response.Status.Verify;

            const user:MongoConfig.Scheme.UserCollect = {
                account,
                pw:"",
                joinT :Date.now().exFloorTimeToSec().toString()
            }
            await MongoInst.roloUsers.insertOne(user);
            return Backend.Response.Status.Success;
        }catch(err){
            return Backend.Response.Status.DBError;
        }
    }

    private static validateEmail(email:string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


}