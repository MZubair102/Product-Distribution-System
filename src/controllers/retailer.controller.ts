import { retailerRepository, userRepository } from "../repository/user.Repository";
import { Request, Response } from "express";
import handleresponse from "../utils/utils";

export class retailerController {
  static async createRetailer(req: Request, res: Response) {
    try {
      const userdata= (req as any).user; // from auth middleware
    //   const { shopName, address, phone } = req.body;

      const user = await userRepository.findById(userdata.id);
      // if (!user) return handleresponse(res, 404, "User not found");

      const payload={
        ...req.body,
        user
      }

      const retailer = retailerRepository.creteRetailer(payload);

    //   await retailerRepository.saveRetailer(retailer);
      handleresponse(res, 201, "Retailer created successfully", payload);
    } catch (error) {
      handleresponse(res, 500, "Internal Server Error", error.message);
    }
  }
}
