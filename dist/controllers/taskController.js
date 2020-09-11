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
exports.TaskStatus = void 0;
const backend_1 = __importDefault(require("../modules/backend"));
require("../extensions/numberExtension");
require("../extensions/dateExtension");
require("../extensions/arrayExtension");
const taskModel_1 = __importDefault(require("../models/taskModel"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Draf"] = 0] = "Draf";
    TaskStatus[TaskStatus["Process"] = 1] = "Process";
    TaskStatus[TaskStatus["Expired"] = 2] = "Expired";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
class TaskController {
    unknowErrorHandler(res, err, msg) {
        // TODO 資料要補寫到System的Log中
        console.log(`##CatchError##:${err instanceof Error ? err.stack : err}`);
        return backend_1.default.Response.error(res, backend_1.default.Response.Status.FailureExecuting, msg, 400);
    }
    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = req.body.account;
                const allTasks = yield taskModel_1.default.getTasks(account);
                backend_1.default.Response.success(res, allTasks);
            }
            catch (err) {
                return this.unknowErrorHandler(res, err);
            }
        });
    }
    /**
     * [API EndPoint] Add Task
     * @param req in
     * @param res out
     */
    addTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const task = {
                    title: req.body.title,
                    content: req.body.content
                };
                const account = req.body.account;
                const tId = taskModel_1.default.generateTaskID(account);
                const bSuccess = yield taskModel_1.default.addTask(account, task, tId);
                if (bSuccess) {
                    return backend_1.default.Response.success(res, {});
                }
                return backend_1.default.Response.error(res, backend_1.default.Response.Status.DBError, "", 201);
            }
            catch (err) {
                return this.unknowErrorHandler(res, err);
            }
        });
    }
    /**
     * [API EndPoint] conform Task
     * @param req in
     * @param res out
     */
    conformTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = req.body.account;
                const tId = req.body.tid;
                const success = yield taskModel_1.default.conformDrafToTask(account, tId);
                return success ? backend_1.default.Response.success(res, {}) : backend_1.default.Response.error(res, backend_1.default.Response.Status.DBError, "", 400);
            }
            catch (err) {
                // return this.unknowErrorHandler(res,err);
            }
        });
    }
}
exports.default = TaskController;
//# sourceMappingURL=taskController.js.map