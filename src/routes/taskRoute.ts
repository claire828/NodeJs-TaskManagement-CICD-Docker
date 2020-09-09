import {Router} from "express";
import TaskController from "../controllers/taskController";
import System from "../modules/system";
import BasicToute from "./basicRoute";

export default class TaskRoute extends BasicToute{

    protected router:Router = Router();
    protected taskController:TaskController = new TaskController();

    constructor(){
        super();
        this.setRoutes();
    }

    protected setRoutes():void{
        // TODO 這邊的前墜可以封裝，直接問發好了
        this.router.post('/task/add', System.Middleware.verifyPostBody, System.Middleware.verifyAuthorize, this.taskController.addTask.bind(this.taskController));
        this.router.post('/task/get', System.Middleware.verifyPostBody, System.Middleware.verifyAuthorize, this.taskController.getTasks.bind(this.taskController));
        this.router.post('/task/conform', System.Middleware.verifyPostBody, System.Middleware.verifyAuthorize, this.taskController.conformTask.bind(this.taskController));
    }


}