"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-namespace
var TedisConfig;
(function (TedisConfig) {
    let Pools;
    (function (Pools) {
        Pools[Pools["Draf"] = 0] = "Draf";
        Pools[Pools["Cache"] = 1] = "Cache";
    })(Pools = TedisConfig.Pools || (TedisConfig.Pools = {}));
})(TedisConfig || (TedisConfig = {}));
exports.default = TedisConfig;
//# sourceMappingURL=tedisConfig.js.map