
declare interface Array<T> {
    /**
     * 移除一個值並且回傳
     * @param index
     */
     exRemoveAt(index: number):T;

}


// tslint:disable-next-line: no-unused-expression
Array.prototype.exRemoveAt || Object.defineProperty(Array.prototype, 'exRemoveAt', {
    enumerable: false,
    value (index: number) {
        const item = this.splice(index, 1);
        return item[0];
    }
})