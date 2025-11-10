import { User } from "../entity/User";
import { datasource } from "../config/data-source";
import { Request, Response } from "express";
import handleresponse from "../utils/utils";
import { adminRepository, userRepository } from "../repository/user.Repository";
import { Encrypt } from "../helpers/encrypt.helper";
import { userRoles } from "../enum/userroles.enum";
import { Admin } from "../entity/Admin";
import * as fs from "fs";
import * as path from "path";

export class UserController {
  static async getallUser(req: Request, res: Response) {
    const users = await userRepository.findAll();
    // const userrepository=datasource.getRepository(User);
    // const users=await userrepository.find();
    handleresponse(res, 200, "All User Find", users);
  }

  static async createUser(req: Request, res: Response) {
    const user = await userRepository.creteUser(req.body);
    if (user.role === userRoles.ADMIN) {
      const newAdmin = new Admin();
      newAdmin.user = user;
      newAdmin.mobile = req.body.mobile;
      newAdmin.department = req.body.department;
      newAdmin.designation = req.body.designation;
      await adminRepository.createadmin(newAdmin);
    }
    handleresponse(res, 201, "User Creted", user);
    // const userrepository=datasource.getRepository(User);
    // const newUser=userrepository.create(req.body);
    // const savedUser=await userrepository.save(newUser);
  }

  static async getUserById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await userRepository.findById(id);
    handleresponse(res, 200, "User Found", user);
  }

  static async updateUser(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await Encrypt.hashPassword(req.body.password);
    }
    const updateuser = await userRepository.updateUser(
      Number(req.params.id),
      req.body
    );
    handleresponse(res, 200, "User Updated Successfully", updateuser);
  }

  static async deleteUser(req: Request, res: Response) {
    const deleteuser = await userRepository.deleteUser(Number(req.params.id));
    handleresponse(res, 200, "User Deleted", deleteuser);
  }

  static async updateProfilePicture(req: Request, res: Response) {
    try {
    //   const userRepo = AppDataSource.getRepository(User);
    //   const { id } = req.params;
      const file = req.file;

      if (!req.file) {
        return handleresponse(res, 400, "No file uploaded");
      }

      const user = await userRepository.findById(Number(req.params.id));
      if (!user) {
        return handleresponse(res, 404, "User not found");
      }

      // Delete old image if exists
      if (user.profilePicture) {
        const oldPath = path.join(__dirname, "../..", user.profilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Generate new file path
      const newImagePath = `/uploads/${file.filename}`;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const fullImageUrl = `${baseUrl}${newImagePath}`;

      // Save in DB
      user.profilePicture = fullImageUrl;
      await userRepository.saveUser(user);

      return res.status(200).json({
        message: "Profile picture updated successfully!",
        data: {
          id: user.id,
          name: user.firstname + " " + user.lastname,
          email: user.email,
          profilePicture: fullImageUrl,
        },
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
