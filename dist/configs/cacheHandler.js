"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskConfig_1 = __importDefault(require("./TaskConfig"));
class CacheHandler {
    mappingDrafToTaskStruct(draf, tId) {
        return {
            title: draf.title,
            content: draf.content,
            tId,
            status: TaskConfig_1.default.Status.Draf
        };
    }
    generateTaskID(account) {
        return `${account}${Date.now().exFloorTimeToSec()}`;
    }
}
exports.default = CacheHandler;
//# sourceMappingURL=cacheHandler.js.map