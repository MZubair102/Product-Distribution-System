import { Repository } from "typeorm";
import { User } from "../entity/User";
import {Encrypt} from "../helpers/encrypt.helper";

export class userService {
    constructor(private userRepository: Repository<User>) { }

    async findAll(): Promise<User[]>//This function will return a Promise that resolves to an array of User objects.
    {
        return await this.userRepository.find();
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }
    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ 
            where:{id}, 
            relations:["admin"]
        });
    }
    async creteUser(user: User): Promise<User> {
        const payload = {
            ...user,
            password: await Encrypt.hashPassword(user.password),
        };
        const newuser = this.userRepository.create(payload);
        return await this.userRepository.save(newuser);
    }
    ////  Add this method to save updated fields
    async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
    }

    async getProfile(userData: any):Promise<User|null> {
        return await this.userRepository.findOneBy({ id:userData.id });
        // console.log("User fetched from DB:", user);
        // if (!user) throw new Error("User not found");
        // return { id: user.id, email: user.email,firstname:user.firstname,lastname:user.lastname };
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error("User not found");
            // return null;
        }
        this.userRepository.merge(user, userData);
        return await this.userRepository.save(user);
    }

    async deleteUser(id: number): Promise<boolean> {
        const user = await this.userRepository.delete({ id });
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