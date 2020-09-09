"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class BasicRoute {
    constructor() {
        this.router = express_1.Router();
    }
    getRouter() {
        return this.router;
    }
}
exports.default = BasicRoute;
//# sourceMappingURL=basicRoute.js.map