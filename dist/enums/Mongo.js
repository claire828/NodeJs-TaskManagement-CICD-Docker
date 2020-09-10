"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-namespace
var CommonDef;
(function (CommonDef) {
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
        function Scheme(a) {
            return {
                data: a,
            };
        }
        Mongo.Scheme = Scheme;
    })(Mongo || (Mongo = {}));
})(CommonDef || (CommonDef = {}));
exports.default = Def;
//# sourceMappingURL=Mongo.js.map