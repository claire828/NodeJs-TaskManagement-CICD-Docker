import MongoInst from "../instances/mongoInst";
import '../extensions/numberExtension';
import '../extensions/arrayExtension';
import '../extensions/stringExtension';
import MongoConfig from "../configs/mongoConfig";
import Backend from "../modules/backend";


export default class AuthModel{

    public static async register(account:string, pw:string, secreat?:string):Promise<Backend.Response.Status>{
        try{
            const isAllow = await this.validateRegist(account);
            if(isAllow) {
                const user:MongoConfig.Scheme.UserCollect = {
                    account,
                    pw, // TODO pw保密(這邊是Client傳進來的,會是Salt？還是只是加密過，server要自己處理？)
                    joinT :Date.now().exFloorTimeToSec().toString()
                }
                MongoInst.roloUsers.insertOne(user);
                return Backend.Response.Status.Success;
            }
            return Backend.Response.Status.Verify;
        }catch(err){
            return Backend.Response.Status.DBError;
        }
    }

    private static validateEmail(email:string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    private static async validateRegist(account:string):Promise<boolean>{
        const bValidation = this.validateEmail(account);
        if(bValidation){
           return !(await this.isUserExist(account));
        }
        return false;
    }

    private static async isUserExist(account:string):Promise<boolean>{
        const result = await MongoInst.roloUsers.findOne({account});
        return (result as unknown as boolean);
    }

}