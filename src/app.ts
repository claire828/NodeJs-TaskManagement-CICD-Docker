import express from 'express';
import { Application } from 'express'
import BodyParse from 'body-parser';
import CookieParse from 'cookie-parser';
import System from './modules/system';
import { Routers } from './routes/routers';
import ServerSetup from './configs/serverSetup';
import TedisInst from './instances/tedisInst';
import MongoInst from './instances/mongoInst';

export default class App{

  public app:Application;

  constructor(){
    this.initialInstances();
    this.app = express();
    this.applyMiddlewares();
    this.addRoutes();
  }

  private async initialInstances(){
     await TedisInst.initRedis();
     await MongoInst.init();
  }

  private applyMiddlewares(){
      this.app.use(BodyParse.json());
      this.app.use(BodyParse.urlencoded({extended:true}));
      this.app.use(CookieParse());
      this.app.use(System.Middleware.addCorsHeader);
  }

  private addRoutes() {
    Routers.forEach(route=> {
      this.app.use(route.getRouter().bind(route));
    });
  }

  public listen() {
      this.app.listen(ServerSetup.server.port, () => {
          console.log(`⚡️[server]: Server is running at http://localhost:${ServerSetup.server.port}`)
      });
  }


}


