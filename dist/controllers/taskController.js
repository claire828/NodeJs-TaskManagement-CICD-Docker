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
const tedisInst_1 = __importDefault(require("../instances/tedisInst"));
const TaskConfig_1 = __importDefault(require("../configs/TaskConfig"));
const mongoInst_1 = __importDefault(require("../instances/mongoInst"));
require("../extensions/numberExtension");
require("../extensions/dateExtension");
require("../extensions/arrayExtension");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Draf"] = 0] = "Draf";
    TaskStatus[TaskStatus["Process"] = 1] = "Process";
    TaskStatus[TaskStatus["Expired"] = 2] = "Expired";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
class TaskController {
    constructor() {
        this.ExpiredHours = 24;
    }
    unknowErrorHandler(res, err, msg) {
        console.log(err instanceof Error ? err.stack : err);
        return backend_1.default.Response.error(res, backend_1.default.Response.Status.FailureExecuting, msg, 401);
    }
    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step2 (skip）先看CacheServer有沒有資料
                // Step3 (skip)CacheServer沒有資料，就抓MongoDB的回存 （skip 4)
                const account = req.body.account;
                const target = yield mongoInst_1.default.roloTasks.findOne({ account });
                for (const tId of target.drafs) {
                    const task = yield tedisInst_1.default.get().get(tId);
                    if (task) {
                        const valueJson = JSON.parse(task.toString());
                        target.tasks.push({
                            title: valueJson.title,
                            content: valueJson.content,
                            tId,
                            status: TaskConfig_1.default.Status.Draf
                        });
                    }
                }
                backend_1.default.Response.success(res, target.tasks);
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
                // TODO 目前是假資料，補上正式的
                const account = req.body.account;
                const taskID = this.generateTaskID(account);
                const tasks = {
                    title: "",
                    content: "",
                };
                yield tedisInst_1.default.get().setex(taskID, this.ExpiredHours.exHoursInSec(), JSON.stringify(tasks));
                yield mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { drafs: taskID } }, { upsert: true });
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                // TODO 資料要補寫到System的Log中
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
                const value = yield tedisInst_1.default.get().get(tId);
                yield tedisInst_1.default.get().del(tId);
                const valueJson = JSON.parse(value.toString());
                const task = {
                    title: valueJson.title,
                    content: valueJson.content,
                    tId,
                    status: TaskConfig_1.default.Status.Conform,
                    t: {
                        st: Date.now().exFloorTimeToSec().toString()
                    }
                };
                yield mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { tasks: task }, $pull: { drafs: tId } }, { upsert: true });
                // TODO Step5 更新到Cache Server (刪除cache)
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                return this.unknowErrorHandler(res, err);
            }
        });
    }
    generateTaskID(account) {
        return `${account}${Date.now().exFloorTimeToSec()}`;
    }
}
exports.default = TaskController;
//# sourceMappingURL=taskController.js.map