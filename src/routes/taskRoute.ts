import {Router} from "express";
import TaskController from "../controller/taskController";
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
        this.router.post('/addTasks', System.Middleware.verifyPostBody, System.Middleware.verifyAuthorize, this.taskController.addTasks.bind(this.taskController));
        this.router.post('/getTasks', System.Middleware.verifyPostBody, System.Middleware.verifyAuthorize, this.taskController.getTasks.bind(this.taskController));
    }




}