import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {Encrypt} from "../helpers/encrypt.helper";

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied" })
    }
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied" })
    }
    const decoded = Encrypt.verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    (req as any).user = decoded;
    // req.headers["user"]=decoded;
    next();

    //   jwt.verify(token, "SECRET_KEY", (err, decoded) => {
    //     if (err) return res.status(403).json({ message: "Invalid token" });
    //     (req as any).user = decoded;
    //     next();
    //   });
};