import { MongoClient, MongoClientOptions } from "mongodb";
import ServerSetup from '../configs/serverSetup';
import MongoConfig from '../configs/mongoConfig'
import { Collection } from "underscore";

class MongoInst {
    private static instance: MongoClient = undefined;

    public static async init(): Promise<void> {
        try {
            const options:MongoClientOptions = {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                authSource:ServerSetup.mongo.authSource,
                auth:{
                    user:ServerSetup.mongo.acc,
                    password:ServerSetup.mongo.pw
                }
            }
            MongoInst.instance = await new MongoClient(`mongodb://${ServerSetup.mongo.host}:${ServerSetup.mongo.port}`, options).connect()
            console.log(`⚡️[mongo]: Server is running at ${ServerSetup.mongo.host}:${ServerSetup.mongo.port}`);
        } catch (e) {
            console.log('Create Mongo Error : ' + (e instanceof Error ? e.stack : e));
        }
    }

    private static get RoloDB(){
        return MongoInst.instance.db(MongoConfig.Dbs.Rolo);
    }

    public static get RoloUsers(){
        return MongoInst.RoloDB.collection<MongoConfig.Scheme.UserCollect>(MongoConfig.Collections.Users);
    }

    public static get RoloTasks(){
        return MongoInst.RoloDB.collection<MongoConfig.Scheme.TaskCollect>(MongoConfig.Collections.Tasks);
    }


}

export default MongoInst;