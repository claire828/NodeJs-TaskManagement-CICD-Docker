// tslint:disable-next-line: no-unused-expression
Array.prototype.exRemoveAt || Object.defineProperty(Array.prototype, 'exRemoveAt', {
    enumerable: false,
    value(index) {
        const item = this.splice(index, 1);
        return item[0];
    }
});
// tslint:disable-next-line: no-unused-expression
Array.prototype.exToString || Object.defineProperty(Array.prototype, 'exToString', {
    enumerable: false,
    value() {
        return JSON.stringify(Object.assign({}, this));
    }
});
//# sourceMappingURL=arrayExtension.js.map