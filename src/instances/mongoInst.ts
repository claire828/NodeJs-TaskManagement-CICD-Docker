import { MongoClient, MongoClientOptions } from "mongodb";
import ServerSetup from '../configs/serverSetup';
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
            this.instance = await new MongoClient(`mongodb://${ServerSetup.mongo.host}:${ServerSetup.mongo.port}`, options).connect()
            console.log(`⚡️[mongo]: Server is running at ${ServerSetup.mongo.host}:${ServerSetup.mongo.port}`);
        } catch (e) {
            console.log('Create Mongo Error : ' + (e instanceof Error ? e.stack : e));
        }
    }

    public static getDb(name: MongoConfig.Dbs) {
        return this.instance.db(name);
    }

    public static get(): MongoClient {
        return this.instance;
    }
}

export default MongoInst;