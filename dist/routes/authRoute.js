"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const basicRoute_1 = __importDefault(require("./basicRoute"));
class AuthRoute extends basicRoute_1.default {
    constructor() {
        super();
        this.router = express_1.Router();
        this.authController = new authController_1.default();
        this.setRoutes();
    }
    setRoutes() {
        this.router.post('/auth/register', this.authController.register.bind(this.authController));
        this.router.post('/auth/login', this.authController.logIn.bind(this.authController));
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=authRoute.js.map