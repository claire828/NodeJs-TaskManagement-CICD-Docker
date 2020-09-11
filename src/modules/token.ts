
import * as Crypto from "crypto";

export class Token<T> {
    private readonly TokenValidateSec = 600;
    private readonly EncodeType = 'base64';
    private secret:string = undefined;

    public constructor(secret:string) {
        this.secret = secret;
    }

    /**
     * Server創造Token -> send back to client
     * @param data
     */
    private encode(data: T): string {
        const dataBase64 = Buffer.from(JSON.stringify(data)).toString(this.EncodeType);
        return `${dataBase64}.${this.signature(dataBase64)}`;
    }

    /**
     * 登入, 解析Client的Token正確與否
     * @param encoded
     * @param salt
     */
    private decode(encoded: string): T {
        const strSplit = encoded.split('.');
        if(strSplit.length === 2){
            const [dataBase64, hmac] = strSplit;
            const sig = this.signature(dataBase64);
            if (sig === hmac){
                const result = Buffer.from(dataBase64, this.EncodeType).toString();
                return (JSON.parse(result) as T);
            }
        }
        return null;
    }


    private signature(data: string): string {
        return Crypto.createHmac('sha512', this.secret).update(data).digest(this.EncodeType);
    }


    public generateToken(account:string){
        const time = Date.now().exFloorTimeToSec();
        const token = LoginToken.encode({
            account,
            t: time,
            expire: time + this.TokenValidateSec
        })
        return token;
    }


    public async isTokenLegal(token:string):Promise<boolean>{
        const infoToken = LoginToken.decode(token);
        console.log(`decodeToken:${JSON.stringify(infoToken)}`);
        const validTime = (this.TokenValidateSec + Date.now().exFloorTimeToSec());
        if(!infoToken || !infoToken.account || !infoToken.expire || infoToken.expire > validTime){
            return false;
        }
        return true;
    }

};

const Secreat = 'LoginTokenMI(*()JMkdj-vi 1-o =24m mdpsai]- 12]j98dsua0[pj';
type TokenStruct = {
    account:string,
    expire:number,
    t:number
};
export const LoginToken = new Token<TokenStruct>(Secreat);

export default Token;