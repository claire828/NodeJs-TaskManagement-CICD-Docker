import TaskRoute from "./taskRoute";
import AuthRoute from "./authRoute"
import BasicRoute from "./basicRoute";


export const Routers: BasicRoute[] = [
    new TaskRoute(),
    new AuthRoute()
];