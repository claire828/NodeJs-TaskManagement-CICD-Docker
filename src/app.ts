import express from 'express';
import { Application } from 'express'
import BodyParse from 'body-parser';
import CookieParse from 'cookie-parser';
import System from './modules/system';
import Backend from './modules/backend';
import mail from './router/mail';


export default class App{

  public app:Application;
  public port:number;

  constructor(port:number){
    this.app = express();
    this.port = port;
     this.useMiddlewares();
     this.useRoutes();
  }

  private useMiddlewares(){
      // for parsing application/Json
      this.app.use(BodyParse.json());
      // for parsing application/x-www-form-urlencorde
      this.app.use(BodyParse.urlencoded({extended:true}));
      this.app.use(CookieParse());
      this.app.use(System.Middleware.addCorsHeader);

  }

  private useRoutes() {

    this.app.route('/mailing').post(System.Middleware.verifyPostBody).post(mail);


    // get只針對get,沒有加入middleware
   // this.app.use('/index', (req, res) => Backend.Response.success(res,{key:"export default System"}));

    // 針對get & post做出資料回應
    /*this.app.route('/test')
      .get((req, res) => res.send('get'))
      .post((req, res) => res.status(403).send('403 Forbidden'));*/


    // 使用use, middleware會使用,並且ＣＵＲＤ也都吃
    // 使用use, 只要前面有對應到的,都會吃下去
    // this.app.use('/main/:id',(req, res) => res.send(`main id:${req.params.id}`));

  }



  public listen() {
      this.app.listen(this.port, () => {
          console.log(`⚡️[server]: Server is running at  http://localhost:${this.port}`)
      })
  }


}


