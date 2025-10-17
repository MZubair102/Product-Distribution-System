import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
// import { User } from "../entity/user.entity.js";
dotenv.config();

const {DB_HOST,DB_PORT,DB_USERNAME,DB_PASSWORD,DB_DATABASE}=process.env;

export const datasource=new DataSource({
    
    type:"postgres",
    host:DB_HOST||"localhost",
    // user:"postgress",
    username:DB_USERNAME||"postgres",
    password:DB_PASSWORD||"1122",
    database:DB_DATABASE||"type_orm",
    port:Number(DB_PORT)||5432,

    synchronize:false,
    logging:false,
    // entities: [User],
    entities:["src/entity/**/*.ts"],
    // entities:["..src/entity/**/*.ts"],
    migrations:["src/migration/**/*.ts"],
    
})