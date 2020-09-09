
declare interface Array<T> {
    /**
     * 移除一個值並且回傳
     * @param index
     */
    ExRemoveAt(index: number):T;
}

/*
Array.prototype.ExRemoveAt || Object.defineProperty(Array.prototype, 'ExRemoveAt', {
    enumerable: false,
    value: function (index: number) {
        let item = this.splice(index, 1);
        return item[0];
    }
})*/