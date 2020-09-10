// tslint:disable-next-line: no-unused-expression
Array.prototype.ExRemoveAt || Object.defineProperty(Array.prototype, 'ExRemoveAt', {
    enumerable: false,
    value(index) {
        const item = this.splice(index, 1);
        return item[0];
    }
});
//# sourceMappingURL=arrayExtention copy.js.map