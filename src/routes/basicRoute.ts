import {Router} from "express";

export default abstract class BasicRoute{
    protected router:Router = Router();
    protected abstract setRoutes(): void;
    public getRouter() {
      return this.router;
    }
}