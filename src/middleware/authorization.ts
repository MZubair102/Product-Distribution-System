import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repository/user.Repository";

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // const user = req.headers["user"] as any;
    const user = (req as any).user;
    const userData = await userRepository.findById(user.id);

    if (userData && !roles.includes(userData.role)) {
      return res.status(403).json({ message: "ForbiddenForbidden: Access denied" });
    }
    next();
  };
};