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
require("../extensions/numberExtension");
require("../extensions/arrayExtension");
require("../extensions/stringExtension");
class CacheModel {
    static getTasks(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const strTasks = yield this.getTask(account);
            if (strTasks)
                return strTasks.exToObj();
            return null;
        });
    }
    // 儲存整筆Task的快取
    static SaveTasksToCache(account, allTasks) {
        tedisInst_1.default.get().setex(account, this.ExpiredSec, JSON.stringify(allTasks));
    }
    // add task (draf)
    static addTask(account, draf, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheList = yield this.getTaskList(account);
            if (cacheList) {
                cacheList.push({
                    title: draf.title,
                    content: draf.content,
                    tId,
                    status: TaskConfig_1.default.Status.Draf,
                });
                this.SaveTasksToCache(account, cacheList);
            }
        });
    }
    // conform DrafToTask
    static conformDrafToTask(account, tId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheList = yield this.getTaskList(account);
            if (cacheList) {
                const inx = cacheList.findIndex(x => x.tId === tId);
                if (inx === -1)
                    return;
                cacheList[inx] = task;
                this.SaveTasksToCache(account, cacheList);
            }
        });
    }
    //TODO 這邊可以用<T>來做
    static getTaskList(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield this.getTask(account);
            return oldCache ? oldCache.exToObj() : null;
        });
    }
    static getTask(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield tedisInst_1.default.get().get(key);
            return (oldCache === null || oldCache === void 0 ? void 0 : oldCache.toString()) || null;
        });
    }
}
exports.default = CacheModel;
CacheModel.ExpiredSec = (4).exHoursInSec();
//# sourceMappingURL=cacheModel.js.map