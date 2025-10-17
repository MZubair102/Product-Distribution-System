import * as express from 'express';
import { Request, Response} from 'express';
import {UserController}from "../controllers/user.controller" ;
import { userDto } from '../dto/user.dto';
import { validator } from '../middleware/validator';

const router=express.Router();

  router.get("/users",UserController.getallUser)
  router.post("/user",validator(userDto),UserController.createUser)
  router.get("/getuser/:id",UserController.getUserById)
  router.put("/updateuser/:id",UserController.updateUser)
  router.delete("/deleteuser/:id",UserController.deleteUser)

  router.get("/user" ,(req:Request,res:Response)=>{
    res.send("Hello World!")
});
export  {router as userRouter};
