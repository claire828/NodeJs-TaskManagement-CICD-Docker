"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const system_1 = __importDefault(require("./modules/system"));
const defRouters_1 = require("./routes/defRouters");
const mail_1 = __importDefault(require("./routes/mail"));
const redis_1 = __importDefault(require("redis"));
const serverSetup_1 = __importDefault(require("./configs/serverSetup"));
class App {
    constructor(port) {
        this.app = express_1.default();
        this.port = port;
        this.runRedis();
        this.applyMiddlewares();
        this.addRoutes();
    }
    applyMiddlewares() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_parser_1.default());
        this.app.use(system_1.default.Middleware.addCorsHeader);
    }
    addRoutes() {
        this.app.use('/mailing', mail_1.default);
        defRouters_1.DefRouters.forEach(route => {
            this.app.use(route.getRouter().bind(route));
        });
    }
    runRedis() {
        this.redisClient = redis_1.default.createClient(serverSetup_1.default.redis.port);
        this.redisClient.on('connect', () => {
            console.log(`⚡️[redis]: Server is running at ${serverSetup_1.default.redis.host}:${serverSetup_1.default.redis.port}`);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${serverSetup_1.default.server.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map