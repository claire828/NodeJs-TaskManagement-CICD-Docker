import * as server from './setup/server.json';
export interface ServerSetup {
    server: {
       port: number
    },
    redis: {
        host: string,
        port: number,
    },
    mongo: {
        host: string,
        port: number,
        acc: string,
        pw: string,
        authSource:string
    }
}

// tslint:disable-next-line: no-var-requires
export const ServerSetup: ServerSetup = server as unknown as ServerSetup;
export default ServerSetup;