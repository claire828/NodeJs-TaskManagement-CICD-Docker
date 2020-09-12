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
const backend_1 = __importDefault(require("../modules/backend"));
require("../extensions/numberExtension");
require("../extensions/dateExtension");
require("../extensions/arrayExtension");
const taskModel_1 = __importDefault(require("../models/taskModel"));
const cacheModel_1 = __importDefault(require("../models/cacheModel"));
const req_1 = require("../modules/req");
class TaskController {
    constructor() {
        this.CacheDbs = {
            taskDb: new taskModel_1.default(),
            cacheDb: new cacheModel_1.default()
        };
    }
    /**
     * [API EndPoint] Get All Tasks
     * @param req in
     * @param res out
     */
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = req_1.Req.parsePostParam(req, {
                account: req_1.Req.ParseParamType.String,
            });
            if (!param)
                return backend_1.default.paramsError(res);
            try {
                let allTasks = yield this.CacheDbs.cacheDb.getAll(param.account);
                if (!allTasks) {
                    allTasks = yield this.CacheDbs.taskDb.getAll(param.account);
                    this.CacheDbs.cacheDb.saveAll(param.account, allTasks);
                }
                backend_1.default.success(res, allTasks);
            }
            catch (err) {
                return backend_1.default.error(res, backend_1.default.Status.FailureExecuting, "", 400);
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
            const param = req_1.Req.parsePostParam(req, {
                account: req_1.Req.ParseParamType.String,
                title: req_1.Req.ParseParamType.String,
                content: req_1.Req.ParseParamType.String
            });
            if (!param)
                return backend_1.default.paramsError(res);
            const draf = {
                title: param.title,
                content: param.content
            };
            const tId = this.CacheDbs.taskDb.generateTaskID(param.account);
            const bSuccess = yield this.CacheDbs.taskDb.add(param.account, draf, tId);
            if (!bSuccess)
                return backend_1.default.error(res, backend_1.default.Status.DBError, "", 400);
            this.CacheDbs.cacheDb.add(param.account, draf, tId);
            return backend_1.default.success(res, {});
        });
    }
    /**
     * [API EndPoint] conform Task
     * @param req in
     * @param res out
     */
    conformTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const param = req_1.Req.parsePostParam(req, {
                account: req_1.Req.ParseParamType.String,
                tId: req_1.Req.ParseParamType.String,
            });
            if (!param)
                return backend_1.default.paramsError(res);
            try {
                const task = yield this.CacheDbs.taskDb.conform(param.account, param.tId);
                if (task) {
                    this.CacheDbs.cacheDb.conform(param.account, param.tId, task);
                    return backend_1.default.success(res, {});
                }
                return backend_1.default.paramsError(res);
            }
            catch (err) {
                return backend_1.default.error(res, backend_1.default.Status.DBError, "", 400);
            }
        });
    }
}
exports.default = TaskController;
//# sourceMappingURL=taskController.js.map