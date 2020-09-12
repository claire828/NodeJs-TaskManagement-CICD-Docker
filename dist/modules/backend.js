"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-namespace
var Response;
(function (Response) {
    let Status;
    (function (Status) {
        Status[Status["Success"] = 0] = "Success";
        Status[Status["InsufficientParams"] = 1] = "InsufficientParams";
        Status[Status["FailureExecuting"] = 2] = "FailureExecuting";
        Status[Status["DBError"] = 11] = "DBError";
        Status[Status["Token"] = 12] = "Token";
        Status[Status["Verify"] = 13] = "Verify";
        Status[Status["UserExisting"] = 14] = "UserExisting";
        Status[Status["EmailError"] = 15] = "EmailError";
    })(Status = Response.Status || (Response.Status = {}));
    function generateResponse(status, message, data) {
        return {
            status,
            message,
            data
        };
    }
    function error(res, code, msg, htmlStatus) {
        console.log(`[Fail] code:${code}, msg:${msg}`);
        const responseInfo = generateResponse(code, msg);
        res.status(htmlStatus).send(responseInfo).end();
    }
    Response.error = error;
    function success(res, data) {
        console.log(`[Success data:${JSON.stringify(data)}`);
        res.send(generateResponse(Status.Success, '', data));
    }
    Response.success = success;
    function verifyError(res) {
        error(res, Status.Verify, "invalid client", 401);
    }
    Response.verifyError = verifyError;
})(Response || (Response = {}));
exports.default = Response;
//# sourceMappingURL=backend.js.map