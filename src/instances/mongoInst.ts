import { MongoClient, MongoClientOptions } from "mongodb";
import ServerSetup from '../setups/serverSetup';
import MongoConfig from '../configs/mongoConfig'

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
            MongoInst.instance = await new MongoClient(`mongodb://${ServerSetup.mongo.host}:${ServerSetup.mongo.port}`, options).connect();
            console.log(`⚡️[mongo]: Server is running at ${ServerSetup.mongo.host}:${ServerSetup.mongo.port}`);
        } catch (e) {
            console.log('Create Mongo Error : ' + (e instanceof Error ? e.stack : e));
        }
    }

    private static get roloDB(){
        return MongoInst.instance.db(MongoConfig.Dbs.Rolo);
    }

    public static get roloUsers(){
        return MongoInst.roloDB.collection<MongoConfig.Scheme.UserCollect>(MongoConfig.Collections.Users);
    }

    public static get roloTasks(){
        return MongoInst.roloDB.collection<MongoConfig.Scheme.TaskCollect>(MongoConfig.Collections.Tasks);
    }


}

export default MongoInst;