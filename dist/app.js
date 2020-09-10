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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middleware_1 = __importDefault(require("./modules/middleware"));
const routers_1 = require("./routes/routers");
const serverSetup_1 = __importDefault(require("./configs/serverSetup"));
const tedisInst_1 = __importDefault(require("./instances/tedisInst"));
const mongoInst_1 = __importDefault(require("./instances/mongoInst"));
class App {
    constructor() {
        this.initial();
    }
    initial() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app = express_1.default();
            this.applyMiddlewares();
            this.addRoutes();
            this.redirectUnexpectedRoute();
            yield this.initialInstances();
        });
    }
    initialInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            yield tedisInst_1.default.init();
            yield mongoInst_1.default.init();
        });
    }
    applyMiddlewares() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_parser_1.default());
        this.app.use(middleware_1.default.log);
        this.app.use(middleware_1.default.addCorsHeader);
        this.app.use(middleware_1.default.verifyPostBody);
    }
    addRoutes() {
        routers_1.Routers.forEach(route => {
            this.app.use(route.getRouter().bind(route));
        });
    }
    redirectUnexpectedRoute() {
        this.app.use(middleware_1.default.unknownRoute);
    }
    listen() {
        this.app.listen(serverSetup_1.default.server.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${serverSetup_1.default.server.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map