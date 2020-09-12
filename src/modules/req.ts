
import express from 'express';
import _ from 'underscore';

// tslint:disable-next-line: no-namespace
export namespace Req{

    type ParamType<T> = T extends (x: infer U) => boolean ? U : never;
    type SKeyValue<T> = {
        [key: string]: T
    };

    export const ParseParamType = {
        Any: () => true,
        String: (x: string) => _.isString(x),
        Number: (x: number) => _.isNumber(x),
        Object: (x: object) => _.isObject(x),
    }


    export function parseParam< K extends keyof typeof ParseParamType,
                                T extends SKeyValue<typeof ParseParamType[K]> >
    (req: express.Request, paramObj: T): { [P in keyof T]: ParamType<T[P]> } | false
    {
        const ret: any = {};
        if (!_.isObject(paramObj)) {
            return false;
        }
        const data = (req.method === "GET") ? req.query : req.body;
        for (const param of Object.keys(paramObj)) {
            const c = data[param];
            // tslint:disable-next-line: ban-types
            const f: Function = paramObj[param];
            if (!f(c)) {
                return false;
            }
            ret[param] = data[param];
        }
        return ret;
    }
}