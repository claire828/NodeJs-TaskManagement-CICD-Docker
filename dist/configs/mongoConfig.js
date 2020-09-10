"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-namespace
var MongoConfig;
(function (MongoConfig) {
    let Dbs;
    (function (Dbs) {
        Dbs["Rolo"] = "rolo";
    })(Dbs = MongoConfig.Dbs || (MongoConfig.Dbs = {}));
    let Collections;
    (function (Collections) {
        Collections["Tasks"] = "tasks";
        Collections["Users"] = "users";
    })(Collections = MongoConfig.Collections || (MongoConfig.Collections = {}));
})(MongoConfig || (MongoConfig = {}));
exports.default = MongoConfig;
//# sourceMappingURL=mongoConfig.js.map