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
// TODO 感覺這個可以新增一個Class作為CacheServer
class TaskModel {
    // [API-getAllTask] 從cache server中取得，如果不存在就從mongo取出
    static getTasksFromCacheServer(account) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("do:取得所有任務清單");
            const strTasks = yield this.getTask(account);
            if (strTasks)
                return strTasks.exToObj();
            console.log("do:CACHE server找不到資料，去MONGO拿");
            const tasks = yield this.retrieveFromServer(account);
            console.log("do:拿到了塞回去");
            this.SaveTasksToCacheServers(account, tasks);
            return tasks;
        });
    }
    // 儲存整筆Task的快取
    static SaveTasksToCacheServers(account, allTasks) {
        tedisInst_1.default.get().setex(account, this.CachedExpiredSec, JSON.stringify(allTasks));
    }
    // 儲存草稿到Mongo&Redis
    static addDrafToServer(account, draf) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tId = this.generateTaskID(account);
                yield Promise.all([
                    tedisInst_1.default.get().setex(tId, this.DrafExpiredSec, JSON.stringify(draf)),
                    mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { drafs: tId } }, { upsert: true })
                ]);
                this.addItemFromCacheList(account, draf, tId);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    static conformDrafToTask(account, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.getTask(tId);
            if (!value)
                return;
            yield tedisInst_1.default.get().del(tId);
            const draf = value.exToObj();
            const mappingStruct = this.generateMappingStruct(draf, tId, TaskConfig_1.default.Status.Conform, {
                st: Date.now().exFloorTimeToSec().toString()
            });
            const task = this.mappingDrafToTaskStruct(mappingStruct);
            yield mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { tasks: task }, $pull: { drafs: tId } }, { upsert: true });
            this.updateItemFromCacheList(account, tId);
        });
    }
    // 原有的快取資料中，新增新的快取
    static addItemFromCacheList(account, draf, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield this.getTask(account);
            if (oldCache) {
                const cacheList = oldCache.exToObj();
                const mappingStruct = this.generateMappingStruct(draf, tId, TaskConfig_1.default.Status.Draf);
                cacheList.push(this.mappingDrafToTaskStruct(mappingStruct));
                this.SaveTasksToCacheServers(account, cacheList);
            }
        });
    }
    static updateItemFromCacheList(account, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCache = yield this.getTask(account);
            if (oldCache) {
                const cacheList = oldCache.exToObj();
                const inx = cacheList.findIndex(x => x.tId === tId);
                cacheList[inx].status = TaskConfig_1.default.Status.Conform;
                this.SaveTasksToCacheServers(account, cacheList);
            }
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
        return __awaiter(this, void 0, void 0, function* () {
            const target = yield mongoInst_1.default.roloTasks.findOne({ account });
            for (const tId of target.drafs) {
                const task = yield this.getTask(tId);
                if (!task)
                    continue;
                const draf = task.exToObj();
                const mappingStruct = this.generateMappingStruct(draf, tId, TaskConfig_1.default.Status.Draf);
                target.tasks.push(this.mappingDrafToTaskStruct(mappingStruct));
            }
            return target.tasks;
        });
    }
    // 媒合草稿到正式
    static mappingDrafToTaskStruct(struct) {
        return {
            title: struct.draf.title,
            content: struct.draf.content,
            tId: struct.tId,
            status: struct.status,
            t: struct.time
        };
    }
    static generateMappingStruct(draf, tId, status, time) {
        return {
            draf,
            tId,
            status,
            time
        };
    }
    static generateTaskID(account) {
        return `${account}${Date.now().exFloorTimeToSec()}`;
    }
}
exports.default = TaskModel;
TaskModel.DrafExpiredSec = (24).exHoursInSec();
TaskModel.CachedExpiredSec = (4).exHoursInSec();
function ReverseObjTo(obj, to) {
    return to;
}
//# sourceMappingURL=taskModel.js.map