// tslint:disable-next-line: no-namespace
namespace Common{
    export function NowInSec():number{
        return Math.floor(Date.now() / 1000);
    }
}
export default Common;