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
const dbModel_1 = __importDefault(require("./dbModel"));
class TaskModel extends dbModel_1.default {
    constructor() {
        super(...arguments);
        this.ExpiredSec = (24).exHoursInSec();
    }
    getAll(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.retrieveFromServer(account);
        });
    }
    saveAll(account, allTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    add(account, draf, tId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    tedisInst_1.default.get().setex(tId, this.ExpiredSec, JSON.stringify(draf)),
                    mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { drafs: tId } }, { upsert: true })
                ]);
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
    conform(account, tId, task) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.retrieveByKey(tId);
            if (!value)
                return null;
            yield tedisInst_1.default.get().del(tId);
            const draf = value.exToObj();
            task = {
                title: (_a = draf.title) !== null && _a !== void 0 ? _a : "",
                content: (_b = draf.content) !== null && _b !== void 0 ? _b : "",
                tId,
                status: TaskConfig_1.default.Status.Conform,
                t: { st: Date.now().exToSec().toString() }
            };
            yield mongoInst_1.default.roloTasks.updateOne({ account }, { $addToSet: { tasks: task }, $pull: { drafs: tId } }, { upsert: true });
            return task;
        });
    }
    retrieveFromServer(account) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const target = yield mongoInst_1.default.roloTasks.findOne({ account });
            const list = (_a = target.tasks) !== null && _a !== void 0 ? _a : [];
            for (const tId of target.drafs) {
                const task = yield this.retrieveByKey(tId);
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
}
exports.default = TaskModel;
//# sourceMappingURL=taskModel.js.map