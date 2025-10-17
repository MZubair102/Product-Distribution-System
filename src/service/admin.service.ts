import { Repository } from "typeorm";
import { Admin } from "../entity/Admin";
import {User} from "../entity/User";
import {Encrypt} from "../helpers/encrypt.helper";

export class adminService {
    constructor(private adminRepository: Repository<Admin>) { }

    async findAll(): Promise<Admin[]>//This function will return a Promise that resolves to an array of User objects.
    {return await this.adminRepository.find();}

    async findById(id: number): Promise<Admin | null> {
        return await this.adminRepository.findOne({
            where:{id},
            relations:["user"]})
         }

    async createadmin(admin: Admin): Promise<Admin> {
        if(!admin.user){
            throw new Error("User is required to create Admin");
        }
        const newuser = this.adminRepository.create(admin);
        return await this.adminRepository.save(newuser);
    }
    
    ////  Add this method to save updated fields
    async saveUser(admin: Admin): Promise<Admin> {
        return await this.adminRepository.save(admin);
    }


    async updateUser(id: number, adminData: Partial<Admin>): Promise<Admin | null> {
        const user = await this.adminRepository.findOneBy({ id });
        if (!user) {
            throw new Error("User not found");
            // return null;
        }
        this.adminRepository.merge(user, adminData);
        return await this.adminRepository.save(user);
    }

    async deleteUser(id: number): Promise<boolean> {
        const user = await this.adminRepository.delete({ id });
        // if(user.affected===0){
        //     return false;
        // }
        // return true;
        return user.affected !== 0;
        // affected = number of rows actually deleted.
        // If at least 1 row was deleted → returns true.
        // If 0 rows were deleted (meaning no user with that ID exists) → returns false.
    }
}