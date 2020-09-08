"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backend_1 = __importDefault(require("../modules/backend"));
const fs_1 = __importDefault(require("fs"));
/*export interface IHello{
    name:any,
}*/
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`收到Mail資訊:${req}, body:${JSON.stringify(req.body)}, params:${JSON.stringify(req.params)}, query:${JSON.stringify(req.query)}`);
    const params = backend_1.default.Req.parseParam(req, {
        name: backend_1.default.Req.ParseParamType.String,
        email: backend_1.default.Req.ParseParamType.String,
        msg: backend_1.default.Req.ParseParamType.String
    });
    if (!params) {
        return backend_1.default.Response.error(res, backend_1.default.Response.ErrorCode.InsufficientParameters, "Insufficient Parameters");
    }
    /* const mapParams = params as Map<string,any>;
     for (const key of mapParams.keys()) {
         console.log(`key:${key}, value:${mapParams.get(key)}`);
     }*/
    try {
        const [name, email, msg, time] = [req.body.name, req.body.email, req.body.msg, Math.floor(Date.now() / 1000)];
        const formate = {
            [time]: {
                name,
                email,
                msg
            }
        };
        fs_1.default.appendFile('msg.txt', JSON.stringify(formate), (err) => {
            if (err) {
                console.log(`error:${err}`);
                return backend_1.default.Response.error(res, backend_1.default.Response.ErrorCode.FailureExecuting, "fail");
            }
            else {
                return backend_1.default.Response.success(res, []);
            }
        });
    }
    catch (err) {
        return backend_1.default.Response.error(res, 101, "傳送emaill失敗");
    }
});
/*const abc:IHello = {
    name :Backend.Req.ParseParamType.String
}
console.log(`what is abc:${JSON.stringify(abc)}`);
const paramsABC = Backend.Req.test(req,abc);
if(!paramsABC) return;
console.log(`mail.ts:${JSON.stringify(paramsABC)}`);
return res.send(`send back ${(paramsABC as IHello).name}`) ;
*/
/* const config:SMTPTransport.Options = {
       host:"http://localhost",
       port:9005,
       secure:true
       }
       const transporter = nodemailer.createTransport(config);
       const mailOptions:SMTPTransport.MailOptions = {
           from: req.body.name,
           to: 'iamclaire.cheng@gmail.com',
           subject: 'Sending Email using Node.js',
           text: req.body.msg,
       };
       transporter.sendMail(mailOptions,(err,info)=>{
           if(err)
               console.log(`error:${err}, info:${info}`);
           else
               return Backend.Response.success(res,[]);
       });
   */ 
//# sourceMappingURL=mail.js.map