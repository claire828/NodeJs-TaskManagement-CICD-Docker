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
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Draf"] = 0] = "Draf";
    TaskStatus[TaskStatus["Process"] = 1] = "Process";
    TaskStatus[TaskStatus["Expired"] = 2] = "Expired";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
class TaskController {
    ResponseError(res, err, msg) {
        console.log(err instanceof Error ? err.stack : err);
        return backend_1.default.Response.error(res, backend_1.default.Response.ErrorCode.FailureExecuting, msg, 201);
    }
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO [API]取得所有Task
                console.log(`receive:[getTasks] ${JSON.stringify(req.body)}`);
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                return this.ResponseError(res, err);
            }
        });
    }
    addTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`receive:[addTasks], ${JSON.stringify(req)}`);
            // TODO HMAC解密
            try {
                yield this.checkUserExist("");
                // TODO Mapping Req資料
                /* const tasks:Task[] = JSON.parse(req.body.tasks);
                 for await(const task of tasks){
                     this.addTask(task);
                 }*/
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                console.log(err instanceof Error ? err.stack : err);
                return backend_1.default.Response.error(res, backend_1.default.Response.ErrorCode.FailureExecuting, '', 201);
            }
        });
    }
    addTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`addSingleTask Name:${task.title}`);
        });
    }
    checkUserExist(account) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO 確認使用者存在否
            console.log(`Check user[${account}] exist or not?`);
            if (false) {
                yield this.createUser(account);
            }
            return new Promise((resolve, reject) => { resolve(); });
        });
    }
    createUser(account) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[Create Account]');
            // TODO 創造帳號
        });
    }
}
exports.default = TaskController;
//# sourceMappingURL=taskController.js.map