import {Router} from "express";
import TaskController from "../controllers/taskController";
import Middleware from "../modules/middleware";
import BasicToute from "./basicRoute";

export default class TaskRoute extends BasicToute{

    protected router:Router = Router();
    protected taskController:TaskController = new TaskController();

    constructor(){
        super();
        this.setRoutes();
    }

    protected setRoutes():void{
        this.router.post('/task/add',
             Middleware.verifyToken,
            this.taskController.addTask.bind(this.taskController)
        );
        this.router.post('/task/get',
             Middleware.verifyToken,
            this.taskController.getTasks.bind(this.taskController)
        );
        this.router.post('/task/confirm',
            Middleware.verifyToken,
            this.taskController.confirmTask.bind(this.taskController)
        );
    }


}