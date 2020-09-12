
import express from 'express';
import _, { map, object } from 'underscore';

// tslint:disable-next-line: no-namespace
namespace Response{

        export enum Status {
            Success = 0,
            InsufficientParams = 1,
            FailureExecuting = 2,
            DBError = 11,
            Token = 12,
            Verify = 13,
            UserExisting = 14,
            EmailError=15
        }
        export interface ServerResponceContent {
            status: Status;
            message: string;
            data?: object;
        }

        function generateResponse(status:Status, message:string, data?: object):ServerResponceContent{
            return {
                status,
                message,
                data
            }
        }

        export function error(res: express.Response, code: Status , msg: string, htmlStatus:number): void {
            console.log(`[Fail] code:${code}, msg:${msg}`);
            const responseInfo:ServerResponceContent = generateResponse(code, msg)
            res.status(htmlStatus).send(responseInfo).end();
        }

        export function success<T extends object>(res: express.Response, data: T): void {
            console.log(`[Success data:${JSON.stringify(data)}`);
            res.send(generateResponse(Status.Success, '',data));
        }

        export function verifyError(res: express.Response ): void {
            error(res, Status.Verify, "invalid client", 401);
        }
}
export default Response;