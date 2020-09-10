// tslint:disable-next-line: no-unused-expression
Date.prototype.exTimeInSecPlusHours || Object.defineProperty(Date.prototype, 'exTimeInSecAfterHours', {
    enumerable: false,
    value(hours) {
        const time = this.now().exCeilTimeToSec() + hours * 60 * 60;
        return time;
    }
});
//# sourceMappingURL=dateExtention.js.map