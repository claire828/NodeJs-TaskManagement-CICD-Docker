"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tedis_1 = require("tedis");
const serverSetup_1 = __importDefault(require("../setups/serverSetup"));
// tslint:disable-next-line: no-namespace
var TedisInst;
(function (TedisInst) {
    let inst;
    function init() {
        return new Promise((resolve, reject) => {
            inst = new tedis_1.Tedis({
                port: serverSetup_1.default.redis.port,
            });
            if (!inst) {
                return reject(`err: cannot create redis`);
            }
            inst.on("connect", () => {
                console.log(`⚡️[redis]: Server is running at ${serverSetup_1.default.redis.host}:${serverSetup_1.default.redis.port}`);
                resolve();
            });
            inst.on("error", (err) => {
                console.log(`err: ${err}`);
            });
            inst.on("close", () => {
                console.log(`Redis connection has closed`);
            });
        }).catch((err) => {
            console.log(`EEEERR:${err}`);
        });
    }
    TedisInst.init = init;
    function get() {
        return inst;
    }
    TedisInst.get = get;
})(TedisInst || (TedisInst = {}));
exports.default = TedisInst;
//# sourceMappingURL=tedisInst.js.map