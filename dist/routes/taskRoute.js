"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
const middleware_1 = __importDefault(require("../modules/middleware"));
const basicRoute_1 = __importDefault(require("./basicRoute"));
class TaskRoute extends basicRoute_1.default {
    constructor() {
        super();
        this.router = express_1.Router();
        this.taskController = new taskController_1.default();
        this.setRoutes();
    }
    setRoutes() {
        // TODO 這邊的前墜可以封裝，直接問發好了
        this.router.post('/task/add', middleware_1.default.verifyPostBody, middleware_1.default.verifyAuthAndMember, this.taskController.addTask.bind(this.taskController));
        this.router.post('/task/get', middleware_1.default.verifyPostBody, middleware_1.default.verifyAuthAndMember, this.taskController.getTasks.bind(this.taskController));
        this.router.post('/task/conform', middleware_1.default.verifyPostBody, middleware_1.default.verifyAuthAndMember, this.taskController.conformTask.bind(this.taskController));
    }
}
exports.default = TaskRoute;
//# sourceMappingURL=taskRoute.js.map