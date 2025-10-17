import { Repository } from "typeorm";
import { User } from "../entity/User";
import {Encrypt} from "../helpers/encrypt.helper";
import { Retailer } from "../entity/Retailer";

export class retailerService {
    constructor(private retailerRepository: Repository<Retailer>) { }

    async findAll(): Promise<Retailer[]>//This function will return a Promise that resolves to an array of User objects.
    {
        return await this.retailerRepository.find();
    }

    // async findByEmail(email: string): Promise<Retailer | null> {
    //     return this.retailerRepository.findOneBy({ email });
    // }

    async findById(id: number): Promise<Retailer | null> {
        return await this.retailerRepository.findOne( {where:{id}});
    }
    async creteRetailer(retailer: Retailer): Promise<Retailer> {
        const newretailer = this.retailerRepository.create(retailer);
        return await this.retailerRepository.save(newretailer);
    }

    ////  Add this method to save updated fields
    async saveRetailer(retailer: Retailer): Promise<Retailer> {
    return await this.retailerRepository.save(retailer);
    }


    async updateRetailer(id: number, userData: Partial<Retailer>): Promise<Retailer | null> {
        const user = await this.retailerRepository.findOneBy({ id });
        if (!user) {
            throw new Error("retailer not found");
            // return null;
        }
        this.retailerRepository.merge(user, userData);
        return await this.retailerRepository.save(user);
    }

    async deleteRetailer(id: number): Promise<boolean> {
        const user = await this.retailerRepository.delete({ id });
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