import * as express from 'express';
import { Request, Response} from 'express';
import { authController } from '../controllers/auth.controller';
import { loginDto, userDto, resetPasswordDto} from '../dto/index';
import {validator,authentication,authorization} from '../middleware/index';
import { userRoles } from '../enum/userroles.enum';
import { retailerController } from '../controllers/retailer.controller';
const router=express.Router();

  
  router.post("/login",validator(loginDto),authController.loginUser)
  router.post("/register",validator(userDto),authController.createUser)
  router.post("/verifyotp",authController.verifyOtp)
  router.post("/resendotp",authController.resendOtp)
  router.post("/forgotpassword",authController.forgotPassword)
  router.post("/resetpassword",validator(resetPasswordDto),authController.resetPassword)
  router.get("/profile",authentication,authorization([userRoles.ADMIN,userRoles.USER]),authController.userProfile)

  router.post("/createretailer",authentication,retailerController.createRetailer)
  

//   router.get("/user" ,(req:Request,res:Response)=>{
//     res.send("Hello World!")
// });
export  {router as authRouter};