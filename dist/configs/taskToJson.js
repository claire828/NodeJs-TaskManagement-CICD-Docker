"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskConfig_1 = __importDefault(require("./TaskConfig"));
class CacheHandler {
    // 只要將Str轉JSON 或者 JSON轉回Object
    mappingDrafToTaskStruct(draf, tId) {
        return {
            title: draf.title,
            content: draf.content,
            tId,
            status: TaskConfig_1.default.Status.Draf
        };
    }
}
exports.default = CacheHandler;
//# sourceMappingURL=taskToJson.js.map