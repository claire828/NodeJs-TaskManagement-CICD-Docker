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
        this.router.post('/auth/register',
            this.authController.register.bind(this.authController)
        );

        this.router.post('/auth/login',
            this.authController.logIn.bind(this.authController)
        );
    }


}