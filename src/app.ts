import express from 'express';
import { Application } from 'express'
import BodyParse from 'body-parser';
import CookieParse from 'cookie-parser';
import Middleware from './modules/middleware';
import { Routers } from './routes/routers';
import ServerSetup from './setups/serverSetup';
import TedisInst from './instances/tedisInst';
import MongoInst from './instances/mongoInst';


export default class App{

  public app:Application;

  constructor(){
    this.initial();
  }

  public async initial(){
    this.app = express();
    this.applyMiddlewares();
    this.addRoutes();
    this.redirectUnexpectedRoute();
    await this.initialInstances();
  }

  private async initialInstances(){
    await TedisInst.init();
    await MongoInst.init();
  }

  private applyMiddlewares(){
    this.app.use(Middleware.noCahce);
    this.app.use(BodyParse.json());
    this.app.use(BodyParse.urlencoded({extended:true}));
    this.app.use(CookieParse());
    this.app.use(Middleware.log);
    this.app.use(Middleware.addCorsHeader);
    this.app.use(Middleware.verifyPostBody);
  }

  private addRoutes() {
    Routers.forEach(route=> {
      this.app.use(route.getRouter().bind(route));
    });
  }

  private redirectUnexpectedRoute(){
    this.app.use(Middleware.unknownRoute);
  }

  public listen() {
    this.app.listen(ServerSetup.server.port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${ServerSetup.server.port}`)
    });
  }


}


