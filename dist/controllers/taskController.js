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
    get stTime() { return Date.now().exFloorTimeToSec(); }
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
                // Step1 取出帳號
                // Step2 (skip）先看CacheServer有沒有資料
                // Step3 (skip)CacheServer沒有資料，就抓MongoDB的回存 （skip 4)
                // Step4 判斷MongoDB中的Draf資料是否過期 -> 比對timestamp -> 如果過期，刪掉redis的資料
                // Step5 Module取得資料，包裝回Json傳回結束
                // const email:string = req.body.email;
                // const task = await TedisInst.get().get(email);
                // Backend.Response.success(res,JSON.parse(task?.toString() || ""));
                backend_1.default.Response.success(res, {});
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
                // Step1 取出帳號
                // Step2 產出taskID (email+timestamp)
                // Step3 將Task放進去Draf DB + 24HExpiredTime
                // Step4 將taskID存進去MongoDB - tasks collections - draf Field (with 24HExpiredTime)
                const email = req.body.email;
                const tasks = {
                    title: req.body.name,
                    st: this.stTime
                };
                yield tedisInst_1.default.get().setex(email, this.ExpiredHours.exHoursInSec(), JSON.stringify(tasks));
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
                // Step1 取出帳號
                // Step2 從redis取出資料
                // Step3 將資料的expire取消 （看要不要刪除）
                // Step4 存到Mongo中
                // Step5 更新到Cache Server (刪除cache)
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                return this.unknowErrorHandler(res, err);
            }
        });
    }
}
exports.default = TaskController;
//# sourceMappingURL=taskController.js.map