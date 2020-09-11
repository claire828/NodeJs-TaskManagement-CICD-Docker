// tslint:disable-next-line: no-unused-expression
String.prototype.exToObj || Object.defineProperty(String.prototype, 'exToObj', {
    enumerable: false,
    value() {
        if (this)
            return JSON.parse(this);
        return {};
    }
});
//# sourceMappingURL=stringExtension.js.map