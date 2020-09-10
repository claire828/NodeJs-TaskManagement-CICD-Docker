import {Router} from "express";
import AuthController from "../controllers/authController";
import Middleware from "../modules/middleware";
import BasicToute from "./basicRoute";

export default class AuthRoute extends BasicToute{

    protected router:Router = Router();
    protected authController:AuthController = new AuthController();

    constructor(){
        super();
        this.setRoutes();
    }

    protected setRoutes():void{
        this.router.post('/auth/register', Middleware.verifyPostBody, Middleware.verifyAuthorize, this.authController.register.bind(this.authController));
        this.router.post('/auth/login', Middleware.verifyPostBody, Middleware.verifyAuthorize, this.authController.logIn.bind(this.authController));
    }


}