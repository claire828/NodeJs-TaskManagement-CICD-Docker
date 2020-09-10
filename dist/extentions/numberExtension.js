// tslint:disable-next-line: no-unused-expression
Number.prototype.exFloor || Object.defineProperty(Number.prototype, 'exFloor', {
    enumerable: false,
    value() {
        return Math.floor(this);
    }
});
// tslint:disable-next-line: no-unused-expression
Number.prototype.exFloorTimeToSec || Object.defineProperty(Number.prototype, 'exFloorTimeToSec', {
    enumerable: false,
    value() {
        return Math.floor(this / 1000);
    }
});
// tslint:disable-next-line: no-unused-expression
Number.prototype.exHoursInSec || Object.defineProperty(Number.prototype, 'exHoursInSec', {
    enumerable: false,
    value() {
        return Math.floor(this) * 60 * 60;
    }
});
//# sourceMappingURL=numberExtension.js.map