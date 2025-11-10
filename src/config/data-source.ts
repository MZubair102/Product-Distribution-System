import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
// import { User } from "../entity/user.entity.js";
dotenv.config();

const {DB_HOST,DB_PORT,DB_USER,DB_PASSWORD,DB_DATABASE}=process.env;

export const datasource=new DataSource({
    
    type:"postgres",
    host:DB_HOST||"aws-1-ap-southeast-2.pooler.supabase.com",
    // user:"postgress",
    username:DB_USER||"postgres.tigabrrfgmnpkkyisptq",
    password:DB_PASSWORD||"1122",
    database:DB_DATABASE||"postgres",
    port:Number(DB_PORT)||5432,

    synchronize:true,
    logging:false,
    // entities: [User],
    entities:["src/entity/**/*.ts"],
    // entities:["..src/entity/**/*.ts"],
    migrations:["src/migration/**/*.ts"],
    
})