import { Tedis, TedisPool } from "tedis";
import ServerSetup from '../setups/serverSetup';

// tslint:disable-next-line: no-namespace
namespace TedisInst{
    let inst:Tedis;

    export async function init(){

        try {
            return new Promise((resolve, reject) => {
                inst = new Tedis({
                    port: ServerSetup.redis.port,
                });
                if (!inst) {
                    return reject(`err: cannot create redis`);
                }
                inst.on("connect", () => {
                    console.log(`⚡️[redis]: Server is running at ${ServerSetup.redis.host}:${ServerSetup.redis.port}`);
                    resolve();
                });
                inst.on("error", (err) => {
                    console.log(`err: ${err}`);
                });
                inst.on("close", () => {
                    console.log(`Redis connection has closed`);
                });
            });
        }
        catch (error) {
            console.log(`EEEERR:${error}`);
        }

    }


    export function get(): Tedis {
        return inst;
    }
}

export default TedisInst;