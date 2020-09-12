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
require("../extensions/numberExtension");
require("../extensions/arrayExtension");
require("../extensions/stringExtension");
const dbModel_1 = __importDefault(require("./dbModel"));
class CacheModel extends dbModel_1.default {
    constructor() {
        super(...arguments);
        this.ExpiredSec = (4).exHoursInSec();
    }
    getTasks(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const strTasks = yield this.retrieveTask(account);
            if (strTasks)
                return strTasks.exToObj();
            return null;
        });
    }
    // 儲存整筆Task的快取
    saveTasks(account, allTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.setex(account, this.ExpiredSec, JSON.stringify(allTasks));
        });
    }
    // add task (draf)
    addTask(account, draf, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheList = yield this.retrieveTaskList(account);
            if (cacheList) {
                cacheList.push({
                    title: draf.title,
                    content: draf.content,
                    tId,
                    status: TaskConfig_1.default.Status.Draf,
                });
                this.saveTasks(account, cacheList);
            }
            return true;
        });
    }
    // conform DrafToTask
    conformTask(account, tId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheList = yield this.retrieveTaskList(account);
            if (cacheList) {
                const inx = cacheList.findIndex(x => x.tId === tId);
                if (inx === -1)
                    return;
                cacheList[inx] = task;
                this.saveTasks(account, cacheList);
            }
            return task;
        });
    }
    // TODO 這邊可以用<T>來做
    retrieveTaskList(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield this.retrieveTask(account);
            return oldCache ? oldCache.exToObj() : null;
        });
    }
}
exports.default = CacheModel;
//# sourceMappingURL=cacheModel.js.map