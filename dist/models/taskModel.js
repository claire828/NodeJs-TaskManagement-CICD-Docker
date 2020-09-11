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
const TaskConfig_1 = __importDefault(require("../configs/TaskConfig"));
const tedisInst_1 = __importDefault(require("../instances/tedisInst"));
const mongoInst_1 = __importDefault(require("../instances/mongoInst"));
require("../extensions/numberExtension");
require("../extensions/arrayExtension");
require("../extensions/stringExtension");
const cacheModel_1 = __importDefault(require("./cacheModel"));
// TODO 感覺這個可以新增一個Class作為CacheServer
class TaskModel {
    // [API-getAllTask] 從cache server中取得，如果不存在就從mongo取出
    static getTasks(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let tasks = yield cacheModel_1.default.getTasks(account);
            if (tasks)
                return tasks;
            console.log("do:CACHE server找不到資料，去MONGO拿");
            tasks = yield this.retrieveFromServer(account);
            cacheModel_1.default.SaveTasksToCache(account, tasks);
            return tasks;
        });
    }
    // 儲存草稿到Mongo&Redis
    static addTask(account, draf, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    tedisInst_1.default.get().setex(tId, this.ExpiredSec, JSON.stringify(draf)),
                    mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { drafs: tId } }, { upsert: true })
                ]);
                cacheModel_1.default.addTask(account, draf, tId);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    static conformDrafToTask(account, tId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.getTask(tId);
            if (!value)
                return false;
            yield tedisInst_1.default.get().del(tId);
            const draf = value.exToObj();
            task = {
                title: draf.title,
                content: draf.content,
                tId,
                status: TaskConfig_1.default.Status.Conform,
                t: { st: Date.now().exFloorTimeToSec().toString() }
            };
            yield mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { tasks: task }, $pull: { drafs: tId } }, { upsert: true });
            cacheModel_1.default.conformDrafToTask(account, tId, task);
            return true;
        });
    }
    static getTask(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield tedisInst_1.default.get().get(key);
            return (oldCache === null || oldCache === void 0 ? void 0 : oldCache.toString()) || null;
        });
    }
    // 從正式ＤＢ中取得資料
    static retrieveFromServer(account) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const target = yield mongoInst_1.default.roloTasks.findOne({ account });
            const list = (_a = target.tasks) !== null && _a !== void 0 ? _a : [];
            for (const tId of target.drafs) {
                const task = yield this.getTask(tId);
                if (!task)
                    continue;
                const draf = task.exToObj();
                list.push({
                    title: draf.title,
                    content: draf.content,
                    tId,
                    status: TaskConfig_1.default.Status.Draf,
                });
            }
            return list;
        });
    }
    static generateTaskID(account) {
        return `${account}${Date.now().exFloorTimeToSec()}`;
    }
}
exports.default = TaskModel;
TaskModel.ExpiredSec = (24).exHoursInSec();
//# sourceMappingURL=taskModel.js.map