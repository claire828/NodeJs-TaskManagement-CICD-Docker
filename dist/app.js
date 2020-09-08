"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const system_1 = __importDefault(require("./modules/system"));
const mail_1 = __importDefault(require("./router/mail"));
class App {
    constructor(port) {
        this.app = express_1.default();
        this.port = port;
        this.useMiddlewares();
        this.useRoutes();
    }
    useMiddlewares() {
        // for parsing application/Json
        this.app.use(body_parser_1.default.json());
        // for parsing application/x-www-form-urlencorde
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_parser_1.default());
        this.app.use(system_1.default.Middleware.addCorsHeader);
    }
    useRoutes() {
        this.app.route('/mailing').post(system_1.default.Middleware.verifyPostBody).post(mail_1.default);
        /* this.app.use(System.Middleware.verifyPostBody);
          this.app.use('/mailing', mail); 用這個的話，上方的middleWare如果還有next() 就會被呼叫兩次 */
        // get只針對get,沒有加入middleware
        // this.app.use('/index', (req, res) => Backend.Response.success(res,{key:"export default System"}));
        // 針對get & post做出資料回應
        /*this.app.route('/test')
          .get((req, res) => res.send('get'))
          .post((req, res) => res.status(403).send('403 Forbidden'));*/
        // 使用use, middleware會使用,並且ＣＵＲＤ也都吃
        // 使用use, 只要前面有對應到的,都會吃下去
        // this.app.use('/main/:id',(req, res) => res.send(`main id:${req.params.id}`));
    }
    // app.use( "/book" , middleware);
    // O will match /book
    // O will match /book/author
    // O will match /book/subject
    // app.all( "/book" , handler);
    // O will match /book
    // X won't match /book/author
    // X won't match /book/subject
    // app.all( "/book/*" , handler);
    // X won't match /book
    // O will match /book/author
    // O will match /book/subject
    listen() {
        this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at  http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
/*
const backend = express();
const PORT = 8000;
backend.get('/', (req, res) => res.send('Express + TypeScript Server'));


*/ 
//# sourceMappingURL=app.js.map