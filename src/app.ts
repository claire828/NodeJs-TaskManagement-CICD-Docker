import express from 'express';
import { Application } from 'express'
import BodyParse from 'body-parser';
import CookieParse from 'cookie-parser';
import System from './modules/system';
import { DefRouters } from './routes/defRouters';
import mail from './routes/mail';
import Redis, { RedisClient } from 'redis'
import ServerSetup from './configs/serverSetup';

export default class App{

  public app:Application;
  public port:number;
  public redisClient:RedisClient;

  constructor(port:number){
    this.app = express();
    this.port = port;
    this.runRedis();
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
    DefRouters.forEach(route=> {
      this.app.use(route.getRouter().bind(route));
    });
  }


  private runRedis(){
    this.redisClient = Redis.createClient(ServerSetup.redis.port);
    this.redisClient.on('connect',()=>{
      console.log(`⚡️[redis]: Server is running at ${ServerSetup.redis.host}:${ServerSetup.redis.port}`);
    });
  }

  public listen() {
      this.app.listen(this.port, () => {
          console.log(`⚡️[server]: Server is running at http://localhost:${ServerSetup.server.port}`)
      });
  }


}


