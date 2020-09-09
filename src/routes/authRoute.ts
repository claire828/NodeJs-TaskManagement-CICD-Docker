import {Router} from "express";
import AuthController from "../controllers/authController";
import System from "../modules/system";
import BasicToute from "./basicRoute";

export default class AuthRoute extends BasicToute{

    protected router:Router = Router();
    protected authController:AuthController = new AuthController();

    constructor(){
        super();
        this.setRoutes();
    }

    protected setRoutes():void{
        this.router.post('/auth/register', System.Middleware.verifyPostBody, System.Middleware.verifyAuthorize, this.authController.register.bind(this.authController));
    }


}