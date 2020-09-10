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
    responseError(res, err, msg) {
        console.log(err instanceof Error ? err.stack : err);
        return backend_1.default.Response.error(res, backend_1.default.Response.Status.FailureExecuting, msg, 401);
    }
    get stTime() { return Date.now().exFloorTimeToSec(); }
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const task = yield tedisInst_1.default.get().get(email);
                backend_1.default.Response.success(res, JSON.parse((task === null || task === void 0 ? void 0 : task.toString()) || ""));
            }
            catch (err) {
                return this.responseError(res, err);
            }
        });
    }
    addTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const bExist = yield this.checkUserExist(email);
                if (!bExist)
                    return backend_1.default.Response.error(res, backend_1.default.Response.Status.Verify, '', 401);
                const tasks = {
                    title: req.body.name,
                    st: this.stTime
                };
                yield tedisInst_1.default.get().setex(email, this.ExpiredHours.exHoursInSec(), JSON.stringify(tasks));
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                // TODO 資料要補寫到System的Log中
                return this.responseError(res, err);
            }
        });
    }
    conformTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return backend_1.default.Response.success(res, {});
            }
            catch (err) {
                return this.responseError(res, err);
            }
        });
    }
    checkUserExist(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return 1;
            // return await TedisInst.get().exists(account);
        });
    }
    createUser(account) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[Create Account]:${account}`);
            yield tedisInst_1.default.get().set(account, "{}");
        });
    }
}
exports.default = TaskController;
//# sourceMappingURL=taskController.js.map