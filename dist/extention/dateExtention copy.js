// tslint:disable-next-line: no-unused-expression
Date.prototype.ExTimeAfterHours || Object.defineProperty(Date.prototype, 'ExTimeAfterHours', {
    enumerable: false,
    value(hours) {
        const time = Math.floor(Date.now() / 1000) * hours * 60 * 60;
        return time;
    }
});
//# sourceMappingURL=dateExtention copy.js.map