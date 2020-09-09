import express from 'express';
import { Application } from 'express'
import BodyParse from 'body-parser';
import CookieParse from 'cookie-parser';
import System from './modules/system';
import { DefRouters } from './routes/defRouters';
import mail from './routes/mail';
import TaskRoute from "./routes/taskRoute";

export default class App{

  public app:Application;
  public port:number;

  constructor(port:number){
    this.app = express();
    this.port = port;
    this.applyMiddlewares();
    this.addRoutes();
  }

  private applyMiddlewares(){
      this.app.use(BodyParse.json());
      this.app.use(BodyParse.urlencoded({extended:true}));
      this.app.use(CookieParse());
      this.app.use(System.Middleware.addCorsHeader);
  }

  private addRoutes() {
    this.app.use('/mailing',mail);
   // const taskRoute:TaskRoute = new TaskRoute();
   // this.app.use(taskRoute.getRouter().bind(taskRoute));
    DefRouters.forEach(route=> {
      this.app.use(route.getRouter().bind(route));
    });
  }

  public listen() {
      this.app.listen(this.port, () => {
          console.log(`⚡️[server]: Server is running at  http://localhost:${this.port}`)
      });
  }


}


