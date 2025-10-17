import { Request, Response } from "express";
import handleresponse from "../utils/utils";
import { adminRepository, userRepository } from "../repository/user.Repository";
import {UserResponseDto} from "../dto/userresponse.dto";
import {Encrypt} from "../helpers/encrypt.helper";
import { sendMail } from "../helpers/nodemailer.helper";
import { userRoles } from "../enum/userroles.enum";
import { Admin } from "../entity/Admin";

export class authController {

  static async forgotPassword(req: Request, res: Response) {
    // console.log("testing: "+req.body.email);
    const { email } = req.body;
    if (!email) {
      handleresponse(res, 400, "Email is required");
    }
    const user = await userRepository.findByEmail(email);

    if (user) {
      // Generate new OTP & expiry
      const otp = await authController.generateOtp();
      console.log("Generated OTP:", otp);
      const otpValidTill = await authController.generateOtpValidTill();
      const updateuser = await userRepository.updateUser(
        user.id,
        {
          otp,
          otpValidTill,
        });
      sendMail({
        to: user.email,
        subject: "Forgot PasswordOTP Code",
        text: `Your forgot password OTP Code is: ${otp}
      \nIt is valid for 5 minutes.${otpValidTill}`
      });
      handleresponse(res, 200, "Forgot Password Email Send Successfully", updateuser);
    } else {
      handleresponse(res, 404, "User Not Found");
    }
  }

  static resetPassword=async(req: Request, res: Response)=> {
    const { email} = req.body;
    const user = await userRepository.findByEmail(email);

    // if(user?.otp!===Number(req.body.otp)&&new Date(){}

    if (user) {
      if (user.otp !== Number(req.body.otp)) {
        handleresponse(res, 400, "Invalid OTP");
      }
      if (new Date() > new Date(user.otpValidTill)) {
        handleresponse(res, 400, "OTP Expired");
      }
      if( user.otp == Number(req.body.otp) && new Date()<=new Date(user.otpValidTill)){
      const updateUser = await userRepository.updateUser(
        user.id,
        {
          // otp: 0,
          // otpValidTill: new Date(0),
          password: await Encrypt.hashPassword(req.body.password)
        });
      // sendMail({
      //   to: user.email,
      //   subject: "Password Reset Successfully",
      //   text: `Your Password Reset Done.`
      // });
      handleresponse(res, 200, "Password Reset Successfully", updateUser);
      }
    } else {
      handleresponse(res, 404, "User Not Found");
    }
  }

  static async createUser(req: Request, res: Response) {
    // console.log("testing: "+req.body.email);
    const { email } = req.body;

    const existinguser = await userRepository.findByEmail(email);
    if (existinguser) {
      handleresponse(res, 400, "User Already Exists");
    }
    const otp = await authController.generateOtp();
    console.log("Generated OTP:", otp);
    const otpValidTill = await authController.generateOtpValidTill();

    const payload = {
      ...req.body,
      otp,
      otpValidTill,
    }
    const user = await userRepository.creteUser(payload);
    // user.otp = otp;
    // user.otpValidTill = otpValidTill;
    // await userRepository.saveUser(user);
    if(user.role===userRoles.ADMIN){
      const newAdmin=new Admin();
      newAdmin.user=user;
      newAdmin.mobile=req.body.mobile;
      newAdmin.department=req.body.department;
      newAdmin.designation=req.body.designation;
      await adminRepository.createadmin(newAdmin);
    }
    // sendMail({
    //   to: user.email,
    //   subject: "your OTP Code",
    //   text: `welcome to our app. Your OTP is: ${otp}\nIt is valid for 5 minutes : ${otpValidTill}`
    // });
    // handleresponse(res, 201, "User Creted", user);
    handleresponse(res, 201, "User Created Successfully",{user:new UserResponseDto(user)} )
  }

  static async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      handleresponse(res, 400, "Email and OTP are required");
    }
    const user = await userRepository.findByEmail(email);
    if (user) {
      if (user.isVerified) {
        handleresponse(res, 400, "User Already Verified", user);
      }
      if (user.otp !== Number(otp)) {
        handleresponse(res, 400, "Invalid OTP", null);
      }
      if (new Date() > new Date(user.otpValidTill)) {
        handleresponse(res, 400, "OTP Expired", null);
      }
      if (user.otp == Number(otp)&&new Date()<=new Date(user.otpValidTill)) {
      const updateuser = await userRepository.updateUser(user.id, {
        isVerified: true,
    });
      handleresponse(res, 200, "Otp Verified Successfully", updateuser)
    }else{
      handleresponse(res, 400, "OTP Verification Failed");
    }
  } else {
    handleresponse(res, 404, "User Not Found", null);
  }
  }

  static async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      handleresponse(res, 400, "Email is required");
    }
    const user = await userRepository.findByEmail(email);
    if (user) {
      if (user.isVerified) {
        handleresponse(res, 400, "User Already Verified", user);
      }
      // Generate new OTP and expiry
      const otp = await authController.generateOtp();
      console.log("Generated OTP:", otp);
      const otpValidTill = await authController.generateOtpValidTill();

      // user.otp = otp;
      // user.otpValidTill = otpValidTill;
      // await userRepository.saveUser(user);
      const updateusr=await userRepository.updateUser(user.id,{
        otp,
        otpValidTill,});
        
      // Send OTP email
      await sendMail({
        to: user.email,
        subject: "Your New OTP Code",
        text: `Your new OTP code is: ${user.otp}\nIt is valid for 5 minutes : ${user.otpValidTill}`,
      });
      handleresponse(res, 200, "OTP resent successfully", updateusr);
    } else {
      handleresponse(res, 404, "User Not Found", null);
    }
  }

  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (user) {
      if (!user || !(await Encrypt.comparePassword(password, user.password))) {
        handleresponse(res, 401, "Invalid email or password");
      }
      if (!user.isVerified) {
        handleresponse(res, 403, "Please verify your email before logging in");
      }
      const payload = { id: user.id };
      const token = await Encrypt.generateToken(payload);
      const refreshToken = await Encrypt.generateRefreshToken(payload);
      handleresponse(res, 200, "Login Successfully", { user, token, refreshToken })
    } else {
      handleresponse(res, 404, "User Not Found");
    }
  }

  static async userProfile(req: Request, res: Response) {
    const userdata = (req as any).user;
    const profile = await userRepository.findById(userdata.id);
    if (profile){
      handleresponse(res, 200, "User profile fetched successfully", profile);
    }else{
      handleresponse(res, 404, "User not found");
    }
  }

  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    try {
      const payload = await Encrypt.verifyToken(refreshToken);
      const newToken = await Encrypt.generateToken({ id: payload.id });
      const newRefreshToken = await Encrypt.generateRefreshToken({
        id: payload.id,
      });
      res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }

  static async generateOtp(): Promise<number> {
    return Math.floor(100000 + Math.random() * 900000);
  }

  static async generateOtpValidTill(): Promise<Date> {
    return new Date(Date.now() + 5 * 60 * 1000); // valid for 5 minutes
  }
}
