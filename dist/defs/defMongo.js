"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-namespace
var Def;
(function (Def) {
    let Mongo;
    (function (Mongo) {
        let Dbs;
        (function (Dbs) {
            Dbs["Rolo"] = "rolo";
        })(Dbs = Mongo.Dbs || (Mongo.Dbs = {}));
        let Collections;
        (function (Collections) {
            Collections["Tasks"] = "tasks";
            Collections["Users"] = "users";
        })(Collections = Mongo.Collections || (Mongo.Collections = {}));
    })(Mongo || (Mongo = {}));
})(Def || (Def = {}));
exports.default = Def;
//# sourceMappingURL=defMongo.js.map