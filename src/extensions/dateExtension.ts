

// tslint:disable-next-line: no-unused-expression
Date.prototype.exNow || Object.defineProperty(Date.prototype, 'exNow', {
    enumerable: false,
    value () {
        return Math.floor(this.now() / 1000);
    }
})
