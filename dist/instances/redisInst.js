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
const redis_1 = __importDefault(require("redis"));
const serverSetup_1 = __importDefault(require("../configs/serverSetup"));
// tslint:disable-next-line: no-namespace
var RedisInst;
(function (RedisInst) {
    let inst;
    function initDB() {
        return __awaiter(this, void 0, void 0, function* () {
            inst = redis_1.default.createClient(serverSetup_1.default.redis.port);
            inst.on('connect', () => __awaiter(this, void 0, void 0, function* () {
                yield console.log(`⚡️[redis]: Server is running at ${serverSetup_1.default.redis.host}:${serverSetup_1.default.redis.port}`);
            }));
        });
    }
    RedisInst.initDB = initDB;
})(RedisInst || (RedisInst = {}));
exports.default = RedisInst;
/*
export default class RedisInst{
    public redisClient:RedisClient;
    private static inst:RedisInst;

    public static get Instance():RedisInst{
        return this.inst || (this.inst = new this());
    }

    constructor(){
       this.initial();
    }

    private initial(){
        this.redisClient = Redis.createClient(ServerSetup.redis.port);
        this.redisClient.on('connect',()=>{
            console.log(`⚡️[redis]: Server is running at ${ServerSetup.redis.host}:${ServerSetup.redis.port}`);
        });
    }

}*/ 
//# sourceMappingURL=redisInst.js.map