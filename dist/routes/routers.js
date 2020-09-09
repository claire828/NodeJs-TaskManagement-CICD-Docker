"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const taskRoute_1 = __importDefault(require("./taskRoute"));
const authRoute_1 = __importDefault(require("./authRoute"));
exports.Routers = [
    new taskRoute_1.default(),
    new authRoute_1.default()
];
//# sourceMappingURL=routers.js.map