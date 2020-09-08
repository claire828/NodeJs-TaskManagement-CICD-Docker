"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = __importDefault(require("./route"));
class AuthRoute extends route_1.default {
    constructor() {
        super();
        this.setRoutes();
    }
    setRoutes() {
        // this.router.get('/login', this.authController.echo);
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=authRoute.js.map