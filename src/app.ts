
import express from 'express';
import { Application } from 'express'
import BodyParse from 'body-parser';
import CookieParse from 'cookie-parser';
import Middleware from './modules/middleware';
import { Routers } from './routes/routers';
import ServerSetup from './setups/serverSetup';
import TedisInst from './instances/tedisInst';
import MongoInst from './instances/mongoInst';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './setups/swagger.json'

export default class App{

  public app:Application;

  constructor(){
    this.initial();
  }

  public initial(){
    this.app = express();
    this.applyMiddlewares();
    this.addRoutes();
    this.redirectUnexpectedRoute();
    this.initialInstances();
  }

  private initialInstances(){
    TedisInst.init();
    MongoInst.init();
  }

  private applyMiddlewares(){
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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


