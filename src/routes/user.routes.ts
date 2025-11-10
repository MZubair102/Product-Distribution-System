import * as express from 'express';
import { Request, Response} from 'express';
import {UserController}from "../controllers/user.controller" ;
import { userDto } from '../dto/user.dto';
import { validator } from '../middleware/validator';
import { upload } from '../helpers/fileupload.helper';

const router=express.Router();

  router.get("/users",UserController.getallUser)
  router.post("/user",validator(userDto),UserController.createUser)
  router.get("/getuser/:id",UserController.getUserById)
  router.put("/updateuser/:id",UserController.updateUser)
  router.delete("/deleteuser/:id",UserController.deleteUser)


  router.put(
  "/profile-picture-upload/:id",
  upload.single("profilePicture"),
  UserController.updateProfilePicture
);

  router.get("/user" ,(req:Request,res:Response)=>{
    res.send("Hello World!")
});
export  {router as userRouter};
