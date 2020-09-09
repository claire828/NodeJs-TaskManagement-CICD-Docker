"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controller/taskController"));
const system_1 = __importDefault(require("../modules/system"));
const basicRoute_1 = __importDefault(require("./basicRoute"));
class TaskRoute extends basicRoute_1.default {
    constructor() {
        super();
        this.router = express_1.Router();
        this.taskController = new taskController_1.default();
        this.setRoutes();
    }
    setRoutes() {
        this.router.post('/addTasks', system_1.default.Middleware.verifyPostBody, system_1.default.Middleware.verifyAuthorize, this.taskController.addTasks.bind(this.taskController));
        this.router.post('/getTasks', system_1.default.Middleware.verifyPostBody, system_1.default.Middleware.verifyAuthorize, this.taskController.getTasks.bind(this.taskController));
    }
}
exports.default = TaskRoute;
//# sourceMappingURL=taskRoute.js.map