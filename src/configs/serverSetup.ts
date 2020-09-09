import * as server from './server.json';
export interface ServerSetup {
    server: {
       port: number
    },
    redis: {
        host: string,
        port: number,
    }
}

// tslint:disable-next-line: no-var-requires
export const ServerSetup: ServerSetup = server as unknown as ServerSetup;
export default ServerSetup;