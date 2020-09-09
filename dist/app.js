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
class App {
    constructor(port) {
        this.app = express_1.default();
        this.port = port;
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
        // const taskRoute:TaskRoute = new TaskRoute();
        // this.app.use(taskRoute.getRouter().bind(taskRoute));
        defRouters_1.DefRouters.forEach(route => {
            this.app.use(route.getRouter().bind(route));
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`⚡️[server]: Server is running at  http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map