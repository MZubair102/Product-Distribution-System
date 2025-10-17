import { User } from "../entity/User";
import { datasource } from "../config/data-source";
import { Request, Response } from "express";
import handleresponse from "../utils/utils";
import { adminRepository, userRepository } from "../repository/user.Repository";
import {Encrypt} from "../helpers/encrypt.helper";
import { userRoles } from "../enum/userroles.enum";
import { Admin } from "../entity/Admin";


export class UserController {

    static async getallUser(req: Request, res: Response) {
        const users = await userRepository.findAll()
        // const userrepository=datasource.getRepository(User);
        // const users=await userrepository.find();
        handleresponse(res, 200, "All User Find", users);
    }

    static async createUser(req: Request, res: Response) {
        const user = await userRepository.creteUser(req.body);
        if(user.role===userRoles.ADMIN){
              const newAdmin=new Admin();
              newAdmin.user=user;
              newAdmin.mobile=req.body.mobile;
              newAdmin.department=req.body.department;
              newAdmin.designation=req.body.designation;
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
        const updateuser = await userRepository.updateUser(Number(req.params.id), req.body);
        handleresponse(res, 200, "User Updated", updateuser);
    }

    static async deleteUser(req: Request, res: Response) {
        const deleteuser = await userRepository.deleteUser(Number(req.params.id));
        handleresponse(res, 200, "User Deleted", deleteuser);
    }

    
}
