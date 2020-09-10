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
const mongodb_1 = require("mongodb");
const serverSetup_1 = __importDefault(require("../configs/serverSetup"));
const mongoConfig_1 = __importDefault(require("../configs/mongoConfig"));
class MongoInst {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                    authSource: serverSetup_1.default.mongo.authSource,
                    auth: {
                        user: serverSetup_1.default.mongo.acc,
                        password: serverSetup_1.default.mongo.pw
                    }
                };
                MongoInst.instance = yield new mongodb_1.MongoClient(`mongodb://${serverSetup_1.default.mongo.host}:${serverSetup_1.default.mongo.port}`, options).connect();
                console.log(`⚡️[mongo]: Server is running at ${serverSetup_1.default.mongo.host}:${serverSetup_1.default.mongo.port}`);
            }
            catch (e) {
                console.log('Create Mongo Error : ' + (e instanceof Error ? e.stack : e));
            }
        });
    }
    static get roloDB() {
        return MongoInst.instance.db(mongoConfig_1.default.Dbs.Rolo);
    }
    static get roloUsers() {
        return MongoInst.roloDB.collection(mongoConfig_1.default.Collections.Users);
    }
    static get roloTasks() {
        return MongoInst.roloDB.collection(mongoConfig_1.default.Collections.Tasks);
    }
}
MongoInst.instance = undefined;
exports.default = MongoInst;
//# sourceMappingURL=mongoInst.js.map